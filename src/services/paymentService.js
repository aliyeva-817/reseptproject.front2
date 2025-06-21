import axios from './axiosInstance';

export const startCheckoutSession = async ({ recipeId, title, image }) => {
  try {
    const response = await axios.post('/stripe/create-checkout-session', {
      recipeId,
      title,
      image,
    });
    if (response.data.url) {
      window.location.href = response.data.url; // Stripe checkout-a yönləndir
    }
  } catch (error) {
    console.error('Checkout başlatma xətası:', error);
    alert('Ödəniş zamanı xəta baş verdi.');
  }
};
