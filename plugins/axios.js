export default function ({$axios}) {
    $axios.onError(error => {
      if (error.response.status === 401) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    })
  }