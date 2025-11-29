import { defineStore } from "pinia";
import { useMiniApp, usePopup } from "vue-tg";
import { ref, computed } from "vue";
import router from "../router";


export const useTgStore = defineStore("tg", () => {
  const miniApp = useMiniApp(); // Внутри функции
  const popup = usePopup();
  const isAuthenticated = ref(false);

  const initData = computed(() => miniApp.initData);
  const userId = computed(() => miniApp.initDataUnsafe?.user?.id);
  const user = computed(() => miniApp.initDataUnsafe?.user);
  const userAvatar = computed(() =>miniApp.initDataUnsafe?.user?.photo_url )
  const userName = computed(() =>miniApp.initDataUnsafe?.user?.username)
  const userLocation = computed(() => miniApp.initDataUnsafe?.user?.location);

  const initializeAuth = async () => {};

  return {
    isAuthenticated,
    user,
    initData,
    userId,
    miniApp,
    initializeAuth,
    userAvatar,
    userLocation,
    userName
  };
});
export const useUserStore = defineStore("user", {
  state: () => ({
    currentUserId: useTgStore.userId,
    count: 0,
    filteredAddresses: [],
    selectedCoordinates: { lat: null, lon: null },
    selectedAddress: "",
    ads: [],
    worldAds: [],
    loading: false,
  }),

  actions: {
    async deleteThisAd(adId) {
      await fetch("https://petlocate.ru/webhook/deleteAd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adId: adId,
        }),
      }).then((response) => {
        if (response.ok) {
         window.location.reload();
        } else {
          console.error("Failed to delete ad");
        }
      })
    },
    async getUserAds(user_id) {
      this.loading = true;
      const response = await fetch(
        "https://petlocate.ru/webhook/getUserAdds",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          userId:323680895, //
          }),
        }
      );
       const data = await response.json();
      this.ads = Array.isArray(data) ? data : [data];
      this.loading = false;
    },

      async getAllAds() {
        this.loading = true;
      const response = await fetch(
        "https://petlocate.ru/webhook/getAllAds",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },

        }
      );
       const data = await response.json();
        this.worldAds = Array.isArray(data) ? data : [data];
        console.log(this.worldAds)
        this.loading = false;
    },

    async createNewAd(ad) {
      this.loading = true;
      await fetch("https://petlocate.ru/webhook/newFindAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ad: ad,
        }),
      }).then((response) => {
        if (response.ok) {
          window.location.reload();
          this.loading = false;
          router.push('/');
        } else {
        
        }
      });
    },

    async uploadImage(file) {
      const CLIENT_ID = "sxkNeeQ896zedL1QqiEV";
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", "Photo from Mini App");

      const response = await fetch("https://api.imageban.ru/v1", {
        method: "POST",
        headers: {
          Authorization: `TOKEN ${CLIENT_ID}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.data.link;
        console.log("Uploaded URL:", imageUrl);
        return imageUrl;
      } else {
        throw new Error("Upload failed");
      }
    },
    async searchAddresses(event) {
      const query = event.query;
      const token = "a2c3836e1483440a86077f7d23c169405924ddc6";

      try {
        const response = await fetch(
          "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Token ${token}`,
              "X-Secret": "2e0536c54e06461d2f12350d038bc234c69a3fcb",
            },
            body: JSON.stringify({ query, count: 10, language: "ru" }),
          }
        );
        const data = await response.json();

        this.filteredAddresses = data.suggestions.map((suggestion) => ({
          name: suggestion.value,
          data: suggestion.data,
        }));
      } catch (error) {
        console.error("Ошибка при запросе адресов:", error);
      }
    },

    async saveUserLocation({ coordinates, address }) {
      this.selectedCoordinates = coordinates;
      this.selectedAddress = address;
    },

    async getCoordinatesByAddress(address) {
      const token = "a2c3836e1483440a86077f7d23c169405924ddc6";
      const secret = "2e0536c54e06461d2f12350d038bc234c69a3fcb";
      try {
        console.log("Входной адрес:", address);
        if (!address || typeof address !== "string" || address.trim() === "") {
          throw new Error("Некорректный адрес");
        }
        console.log("Входной адрес:", address);

        const response = await fetch("/dadata/api/v1/clean/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${token}`,
            "X-Secret": secret,
          },
          body: JSON.stringify([address.trim()]),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ошибка ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Ответ сервера:", data);

        if (data && data.length > 0) {
          const { geo_lat, geo_lon } = data[0];
          if (geo_lat && geo_lon) {
            this.selectedCoordinates = {
              lat: parseFloat(geo_lat),
              lon: parseFloat(geo_lon),
            };
            this.selectedAddress = address;
            return this.selectedCoordinates;
          }
        }
        console.warn("Координаты не найдены");
        return null;
      } catch (error) {
        console.error("Ошибка получения координат:", error.message);
        return null;
      }
    },

    async addressByCoordinates(coordinate) {
      const token = "a2c3836e1483440a86077f7d23c169405924ddc6";
      try {
        const response = await fetch(
          "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Token ${token}`,
              "X-Secret": "2e0536c54e06461d2f12350d038bc234c69a3fcb",
            },
            body: JSON.stringify({
              lat: coordinate.lat,
              lon: coordinate.lon,
              count: 1,
              language: "ru",
            }),
          }
        );
        const data = await response.json();

        if (data.suggestions && data.suggestions.length > 0) {
          this.selectedAddress = data.suggestions[0].value;
          return this.selectedAddress;
        } else {
          this.selectedAddress = "";
          return null;
        }
      } catch (error) {
        console.error("Ошибка получения адреса:", error);
        this.selectedAddress = "";
        return null;
      }
    },
  },
});
