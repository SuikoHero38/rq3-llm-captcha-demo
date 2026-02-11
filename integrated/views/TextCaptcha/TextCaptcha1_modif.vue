<template>
  <div class="captcha-container">
    <h1 style="display: flex; justify-content: center; align-items: center;">TEXT CAPTCHA {{ numberOfTries }}</h1>
    <h2 style="display: flex; justify-content: center; align-items: center; margin-top: 20px; margin-bottom: 20px;">Enter the text below</h2>
    <canvas ref="captchaCanvas" width="300" height="100"></canvas>
    <input v-model="userInput" placeholder="Enter CAPTCHA" />
    <div class="captcha-button-container">
      <button @click="verifyCaptcha" class="captcha-button">Verify</button>
      
      
      </div>
      <img v-if="showGif" :src="gifUrl" alt="Alert GIF" class="alert-gif" />
</div>
</template>

<script>
import axios from 'axios';
import { mapActions , mapState, mapGetters} from 'vuex';
import successGif from '../../assets/images/verification_success.gif'; // Path to your success GIF
import failureGif from '../../assets/images/verification_failure.gif';
export default {
  data() {
    return {
      captchaText: '',
      numberOfTries: 0,
      userInput: '',
      captchaVerified: false,
      timerSpent: 0,
      clickedtoVerification: false,
      showGif: false,
      gifUrl: '',
      captchaSolution: '',//Add these new
      generatedText: '', //Add these new
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    gifUrl: {
      type: String,
      required: true,
    },
  },
    };
  },
  beforeMount() {
    this.entryTime = new Date(); // Record the entry time
    this.startTimer();
  },
  beforeDestroy() {
    this.stopTimer();
  },
  mounted() {
    this.generateCaptcha();
    this.processData(); //Add this new
  },
  computed: {
    ...mapGetters(['getShuffledCaptchaPages']),
    ...mapState({
      attempts: (state) => state.captchaAttempts_text,
    }),
  },
  methods: {
    ...mapActions(['updateTextPageTimeSpent','updateTextPageNumberOfAttempts','incrementAttempts_text']),

      saveTheTime() {
      this.updateTextPageTimeSpent(this.timerSpent);
      this.updateTextPageNumberOfAttempts(this.numberOfTries);
    },
      startTimer() {
      this.timer = setInterval(() => {
        this.timerSpent = Math.floor((new Date() - this.entryTime) / 1000);
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
    },
    generateCaptcha() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      this.captchaText = Array.from({ length: 6 })
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join('');

      this.drawCaptcha();
    },
    drawCaptcha() {
      const canvas = this.$refs.captchaCanvas;
      const ctx = canvas.getContext('2d');

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set background color
      ctx.fillStyle = '#f4f4f4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add noise (lines and dots)
      for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = this.randomColor();
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = this.randomColor();
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw CAPTCHA text
      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = this.randomColor();
      ctx.textBaseline = 'middle';

      const textWidth = ctx.measureText(this.captchaText).width;
      const x = (canvas.width - textWidth) / 2;
      const y = canvas.height / 2;

      ctx.fillText(this.captchaText, x, y);

      // Additional distortion
      ctx.setTransform(1, Math.random() * 0.2, Math.random() * 0.2, 1, 0, 0);
      ctx.fillText(this.captchaText, x, y);
    },
    randomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    },
    verifyCaptcha() {
      if (this.userInput === this.captchaText) {
        this.gifUrl = successGif; // Set the success GIF
        this.showGif = true;
        this.showSuccess = true;
        this.saveTheTime(); 

        setTimeout(() => {
          this.showGif = false;
        this.$router.push('/TextCaptcha2');
        }, 3000);
      } else {
          this.gifUrl = failureGif; // Set the failure GIF
        this.showGif = true; 
        this.generateCaptcha();
        this.userInput = "";

        setTimeout(() => {
          this.showGif = false; // Hide the GIF after 3 seconds
        }, 3000);
        }
      this.numberOfTries++;
        //this.incrementAttempts_text();
          if (this.numberOfTries >= 5) {
            this.$router.push('/TextCaptcha2');
          }
    },//Add a new method
    async processData() {
        const canvas = this.$refs.captchaCanvas;
        canvas.toBlob(blob => {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1]; // Mengambil hanya bagian data dari base64
                try {
                    const response = await axios.post('http://localhost:3000/api/process-data', {
                        imageData: base64data
                    });
                    this.captchaSolutionGemini = response.data.captchaSolutionGemini;
                    this.captchaSolutionGPT4 = response.data.captchaSolutionGPT4;
                } catch (error) {
                    console.error('Error processing the data:', error);
                }
            };
            reader.readAsDataURL(blob);
        });
    }
  }
};
</script>

<style scoped>
.alert-gif {
  position: fixed;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  z-index: 1000;
  border-radius: 10px;
}
.captcha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  background-color: #a8e685;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font: 1em cosmic sans;
  font-size: 130%;
  margin-top: auto;
  font-family: 'OpenDyslexic', Arial, sans-serif;
}
.captcha-canvas {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  margin: 50px;
  width: 300px;
  height: 100px;
  text-align: center;
  font-size: 50px;
  color: #000;
}
.captcha-text {
    font-size: 50px;
    margin-bottom: 20px;
    margin-top: 50px;
  }
input {
  margin-bottom: 10px;
  padding: 5px;
  font-size: 16px;
}
button {
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
}
.captcha-button-container 
  {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .captcha-button {
    font-size: 1rem;
  padding: 1rem 2rem;
  margin-top: 2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #0ea6e3;
  color: #fff;
  }
  
  .captcha-button:hover {
    background-color: #0056b3;
  }

canvas {
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

input {
  margin-bottom: 10px;
  padding: 5px;
  font-size: 16px;
}
</style>
