<template>
    <vue-particles 
    id="tsparticles" 
    :options="particlesOptions"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const particlesOptions = ref(
    {
        background: {
            color: {
                // value: "#CCCCFF",
                value: "rgba(204, 204, 255, 0.3)"
            },
        },
        fullScreen: {
            enable: true,
            zIndex: 0
        },
        opacity: {
            value: 1,
            random: true,
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "grab",
                },
            },
            modes: {
                bubble: {
                    distance: 400,
                    duration: 2,
                    opacity: 0.8,
                    size: 40,
                },
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "random",
                animation: {
                    enable: true,
                    speed: 20,
                    sync: true,
                },
            },
            links: {
                color: "random",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: "bounce",
                random: false,
                speed: 3,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
    }
);
</script>

<style scoped></style>