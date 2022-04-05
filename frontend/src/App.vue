<template>
  <div id="app">
    <div class = "removalSection">
      <div class = "button"  @click ="removeClientAddr()">Want Privacy?</div>
    </div>
    <div class="cascade" v-for="address in addresses" :key="address.address">
        <marquee :style="`color: ${getRandColor()};  top:${getRandomVerticalPos()}px`" >
           <p @click ="displayDetails(address)">{{address.address}}</p>
           </marquee>
      </div>
    <main>
      <div id="greeting" >
        <h1>You were here</h1>
        <div id="details">
          <!-- <h2>{{selectedAddress.address}}</h2>
          <p>Was here on {{selectedAddress.time}}</p> -->
        </div>
      </div>
    </main>
    <footer>
      <p>We add the IP address of every person who visits this page. Click on an IP address to learn more about them.</p>
      <p>Our code is open source and can be found here: <a href= "https://github.com/Ragiarc/YouWereHere.git">github</a></p>
    </footer>
  </div>
</template>



<script>
// @ is an alias to /src
import axios from 'axios';
export default {
  name: 'App',
  mounted() {
      let geoScript = document.createElement('script');
      geoScript.setAttribute('src', 'http://www.geoplugin.net/javascript.gp')
      document.head.appendChild(geoScript);
    },
  data() {
    return {
      addresses: [],
      clientAddress: '',
      //selectedAddress: '',
    }
  },
  created() {
    this.addAddress();
  },
  computed: {
    numAddresses() {
      return this.addresses.length;
    }
  },
  methods: {
    async getAddresses() {
      try {
        let response = await axios.get("/api/addresses");
        this.addresses = response.data;
        return true;
      } catch(error) {
        console.log(error);
      }
    },
    async addAddress() {
      
      await fetch('https://api.ipify.org?format=json')
      .then(x => x.json())
      .then(({ ip }) => {
        this.clientAddress = ip;
        this.selectedAddress = ip;
      }); 
      
      let response = '';
      await fetch('http://www.geoplugin.net/json.gp?ip=' + this.clientAddress)
      .then(data => data.json())
      .then(success => response = success);
      // .then(x => x.json()) {
      //   clientCity = x.geoplugin_city;
      // };
      // .then(({ geoplugin_city }, { geoplugin_countryName }) => {
      //   clientCity = geoplugin_city;
      //   // region = geoplugin_region;
      //   nation = geoplugin_countryName;
      // })
      // .then(({ geoplugin_region }) => {
      //   region = geoplugin_region;
      // })
      // .then(({ geoplugin_countryName }) => {
      //   nation = geoplugin_countryName;
      // }); 
      let clientCity = response.geoplugin_city;
      let region = response.geoplugin_region;
      let nation = response.geoplugin_countryName;
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = mm + '/' + dd + '/' + yyyy;
      

      try {
        await axios.post("/api/add", {
        address: this.clientAddress,
        time: today,
        city: clientCity,
        region: region,
        nation: nation
        }); 
        this.getAddresses();
      } catch(error) {
        console.log(error)
      }
  },
  async removeClientAddr() {
    try {
      await axios.delete("/api/remove/" + this.clientAddress); 
      this.getAddresses();
      return true;
    } catch(error) {
        console.log(error)
    }
    document.getElementById("greeting").innerHTML = "<h1>You were NEVER here.</h1><div id='details'></div>";
    document.getElementById("details").innerHTML = "<h2>We've removed you from our database.</h2>";
    
  },
  getRandColor() {
    let colors = ["#E9EB9E", "#FED18C", "#44AF69", "#414535", "#35FF69", "#7A542E", "#21897E", "#A4AF69"]
    return colors[Math.floor(Math.random()*colors.length)];
  },
  getRandomVerticalPos() {
    return Math.floor(Math.random()* window.innerHeight);
  },
  displayDetails(address) {
    //this.selectedAddress = address
    document.getElementById("details").innerHTML = "<h2>" + address.address + "</h2>" +
    "<p>Was here on " + address.time + "</p><p>They live in " + address.city + ", " + address.region
    + " " + address.nation;
    console.log(address.time)
  }
}
}
</script>


<style>
html {
  box-sizing: border-box;
}

body {
  background-color: #C1EEFF;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #C1EEFF;
  height: 100vh;
  width: 100vw;
}

marquee {
  z-index: 5 + 3px;
  position:absolute;
  left:18px;
  top:97px;
  font-family:Cursive;
  font-size:14pt;
  height:200px;
}

marquee p:hover {
  cursor: pointer;
}

.button {
  margin: 10px;
  border: solid 2px #7D5BA6;
  border-radius: 10px;
  width: 10vw;
}

.button:hover {
  cursor: pointer;
}

main {
  display: flex;
  height: 90vh;
  justify-content: space-around;
  align-items: center;
}

#greeting {
  color: #7D5BA6;
  text-align: center;
}

footer {
  height: 10vh;
  line-height: 1em;
  color: #FC6471;
}
</style>
