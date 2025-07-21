<template>
  <div>
    <!-- 设置label-width使得表单每行的标题自动对齐 -->
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请你输入SPU名称"
          v-model="form.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select placeholder="请选择品牌" v-model="form.tmId">
          <el-option
            v-for="(item, index) in attrArr"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          placeholder="请你输入描述"
          type="textarea"
          v-model="form.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU照片">
        <ImageUploader
          v-model:imageList="form.spuImageList"
          action="/api/myApi/product/spu/uploadImage"
          :limit="5"
        />
      </el-form-item>

      <el-form-item label="SPU销售属性">
        <!-- 选择销售属性 + 添加 -->
        <el-select
          v-model="currentSaleName"
          :placeholder="`当前还有${unselectedAttrCount}个销售属性未设置`"
          style="width: 240px"
        >
          <el-option
            v-for="item in availableAttrs"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="addSaleAttr"
        >
          + 添加属性
        </el-button>

        <!-- 销售属性表格 -->
        <el-table :data="saleEditors" border>
          <el-table-column label="序号" type="index" width="80px" />
          <el-table-column label="销售属性名" prop="attrName" width="100px" />
          <el-table-column label="销售属性值">
            <template #default="{ row }">
              <div style="display: flex; flex-wrap: wrap; gap: 4px">
                <!-- tag 或 input 切换 -->
                <template v-for="(item, idx) in row.attrValues" :key="idx">
                  <!-- 这里时可关闭的tag -->
                  <el-tag
                    v-if="!item.editing"
                    closable
                    @close="removeAttrValue(row, idx)"
                    @click="editAttrValue(row, idx)"
                  >
                    {{ item.value }}
                  </el-tag>
                  <el-input
                    v-else
                    v-model="item.value"
                    @blur="saveAttrValue(row, idx)"
                    style="width: auto; min-width: 30px"
                  />
                </template>
                <!-- 每行添加按钮 -->
                <el-button
                  icon="Plus"
                  type="primary"
                  @click="addAttrValue(row)"
                  style="width: 35px; height: 25px"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template #="{ row, $index }">
              <!-- pop框提示是否确认删除 -->
              <el-popconfirm
                :title="`确认删除${row.value}吗？`"
                width="200px"
                @confirm="removeAttrRow($index)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    icon="Delete"
                    style="width: 35px; height: 25px"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reqSpuAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import useCategoryStore from '@/store/modules/category'
import type {
  SpuAttrResponseData,
  SpuAttrValue,
  SpuRecordList,
  SpuPoster,
  SpuData,
  SpuSaleAttr,
  EditableSpuPoster,
} from '@/api/product/spu/type' //attrValueNew
import { reactive, ref, nextTick, watch, computed } from 'vue'
// 引入上传图片组件
import ImageUploader from '@/components/ImageUploader/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取父组件传过来的prop：修改时用到
const props = defineProps<{
  spuArr?: SpuData
}>()
// 通值父组件改变场景和刷新数据
const $emit = defineEmits(['changeScene', 'refreshSpuList'])
// 暴露给父组件用，获取当前三级id下的品牌数据
defineExpose({
  getAttrList,
})

// 获取仓库
let categoryStore = useCategoryStore()
// 当前选中的品牌id
// const selectedBrandId = ref<string>('')
// 存储品牌数据
let attrArr = ref<SpuAttrValue[]>([])
// 表单编辑/新增状态
const isEdit = computed(() => !!props.spuArr?.id)

// 销售属性对象
const saleEditors = ref<EditableSpuPoster[]>([])

const currentSaleName = ref('')
const spuSaleList = ref(['颜色', '版本', '尺码']) // 可选项

// 是否有未保存更改
const isFormDirty = ref(true)

// 表单对象
const form = reactive<SpuData>({
  spuName: '',
  tmId: '',
  description: '',
  category3Id: '',
  spuImageList: [],
  spuSaleAttrList: [],
  spuPosterList: [],
})
// 监听三级id，如果有就添加到表单
watch(
  () => categoryStore.c3Id,
  (newVal) => {
    form.category3Id = newVal
  },
)
// 重置表单
const resetForm = () => {
  form.spuName = ''
  form.tmId = ''
  form.description = ''
  form.category3Id = ''
  form.spuImageList = []
  form.spuSaleAttrList = []
  form.spuPosterList = []
  saleEditors.value = []
}

// 监视传过来的值是不是空，判断是编辑还是新增
watch(
  () => props.spuArr,
  (newVal) => {
    if (newVal) {
      form.spuName = newVal.spuName
      form.description = newVal.description
      form.tmId = newVal.tmId
      form.category3Id = newVal.category3Id
      form.spuImageList = [...(newVal.spuImageList || [])]
      // 初始化当前的销售属性对象
      saleEditors.value = (newVal.spuPosterList || []).map((item) => ({
        attrName: item.attrName,
        attrValues: item.attrValues.map((v) => ({
          value: v,
          editing: false,
        })),
      }))
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

/** 添加一个销售属性行 */
function addSaleAttr() {
  if (!currentSaleName.value) {
    ElMessage.warning('请选择销售属性')
    return
  }

  const exists = saleEditors.value.some(
    (e) => e.attrName === currentSaleName.value,
  )
  if (exists) {
    ElMessage.warning('该销售属性已添加')
    return
  }

  saleEditors.value.push({
    attrName: currentSaleName.value,
    attrValues: [],
  })
  currentSaleName.value = ''
  isFormDirty.value = true
}
// 添加一个空属性值（进入编辑状态）
function addAttrValue(row: EditableSpuPoster) {
  row.attrValues.push({ value: '', editing: true })
}

// 删除属性值
function removeAttrValue(row: EditableSpuPoster, idx: number) {
  row.attrValues.splice(idx, 1)
}

// 点击 tag 切换成 input
function editAttrValue(row: EditableSpuPoster, idx: number) {
  row.attrValues[idx].editing = true
  nextTick(() => {
    // 可选：focus input
  })
}

// 失焦保存值（去空、去重），并变回 tag
function saveAttrValue(row: EditableSpuPoster, idx: number) {
  const val = row.attrValues[idx].value.trim()
  if (!val) {
    row.attrValues.splice(idx, 1)
    ElMessage.warning('属性值不能为空，已移除')
    return
  }

  const isDuplicate = row.attrValues.some(
    (v, i) => v.value === val && i !== idx,
  )
  if (isDuplicate) {
    row.attrValues.splice(idx, 1)
    ElMessage.warning('属性值重复，已移除')
    return
  }

  row.attrValues[idx].value = val
  row.attrValues[idx].editing = false
}

// 删除整行
function removeAttrRow(index: number) {
  saleEditors.value.splice(index, 1)
}

// 计算当前还有多少个销售属性未被选择
const unselectedAttrCount = computed(() => {
  const selected = saleEditors.value.map((item) => item.attrName)
  return spuSaleList.value.filter((attr) => !selected.includes(attr)).length
})

// 设置已经选择的销售属性不能再被选择
const availableAttrs = computed(() => {
  return spuSaleList.value.filter(
    (attr) => !saleEditors.value.some((e) => e.attrName === attr),
  )
})

// 获取品牌的回调，暴露给父组件调用
async function getAttrList() {
  if (categoryStore.c3Id) {
    try {
      let result: SpuAttrResponseData = await reqSpuAttr(categoryStore.c3Id)
      // console.log(result);
      attrArr.value = result.data
      // console.log(attrArr);
    } catch (error) {
      console.log('请求出错', error)
    }
  } else {
    console.warn('c3id不存在')
  }
}

// 提交表单
const submit = async () => {
  form.category3Id = categoryStore.c3Id
  form.spuPosterList = saleEditors.value.map((item) => ({
    attrName: item.attrName,
    attrValues: item.attrValues.map((val) => val.value),
  }))

  // 判断当前销售属性选择里哪几个是添加了属性的
  const allAttr: SpuSaleAttr['attrName'][] = ['颜色', '版本', '尺码']
  const selecteAttrs = form.spuPosterList.map((item) => item.attrName)
  const saleAttrList: SpuSaleAttr[] = allAttr.map((attr) => ({
    attrName: attr,
    flag: selecteAttrs.includes(attr) ? 1 : 0,
  }))
  form.spuSaleAttrList = saleAttrList
  // console.log("当前表单",form);
  // 浅拷贝当前表单
  // 1、可以添加额外字段（比如 id）
  // 2、不会污染原始表单 form
  // 3、不会误触发双向绑定
  const payload = { ...form }
  if (isEdit.value) {
    // 添加id字段
    payload.id = props.spuArr?.id
    // console.log("当前表单", payload);
    try {
      let result = await reqAddOrUpdateSpu(payload)
      if (result.code === 200) {
        ElMessage.success('修改spu成功')
      } else {
        ElMessage.error('修改失败')
      }
      $emit('changeScene', 1)
      $emit('refreshSpuList')
      // console.log(result);
      // console.log("当前销售属性添加情况", saleAttrList);
    } catch (error) {
      console.log('网络出现问题', error)
    }
  } else {
    try {
      let result = await reqAddOrUpdateSpu(form)
      if (result.code === 200) {
        ElMessage.success('添加spu成功')
      } else {
        ElMessage.error('添加失败')
      }
      $emit('changeScene', 1)
      $emit('refreshSpuList')
      // console.log(result);
      // console.log("当前销售属性添加情况", saleAttrList);
    } catch (error) {
      console.log('网络出现问题', error)
    }
  }
}
// 取消表单，通知父组件修改场景
const cancel = () => {
  $emit('changeScene', 1)
  // 清空销售属性的选择和表单数据
  currentSaleName.value = ''
  saleEditors.value = []
}
</script>

<style scoped></style>
