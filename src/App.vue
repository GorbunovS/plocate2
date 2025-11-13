<script setup>
import { ref, onMounted } from 'vue'
import './style.css'
import Alert from 'vue-tg'

const showAlert = ref(false)
const alertMsg = ref('')

const showTemporaryAlert = (message) => {
  alertMsg.value = message
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
  }, 3000)
}

onMounted(() => {
  // Получаем объект WebApp от Telegram SDK
  if (window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp
    webApp.ready()

    // Получаем данные пользователя
    const user = webApp.initDataUnsafe?.user

    if (user) {
      const userName = user.first_name || 'Пользователь'
      const fullName = user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : userName

      showTemporaryAlert(`Привет, ${fullName}!`)
      
      // Если нужны все данные:
      console.log('Полные данные пользователя:', {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        photoUrl: user.photo_url,
        isPremium: user.is_premium,
        languageCode: user.language_code
      })
    } else {
      showTemporaryAlert('Ошибка: данные пользователя недоступны')
    }
  } else {
    showTemporaryAlert('Ошибка: Telegram SDK не загружен')
  }
})
</script>

<template>
  <div>
    <Alert v-if="showAlert" :message="alertMsg" />
    <router-view></router-view>
  </div>
</template>

<style>
.leaflet-bottom {
  visibility: hidden;
}
</style>


