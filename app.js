const baseURL = "https://api.twitch.tv/helix/";
axios.defaults.headers.common['Client-ID'] = 'CLIENT ID HERE';


Vue.component('streams-list', {
  props: ['ow'],
  template: `
    <div>
      <div class="row">
        <div class="columns large-3 medium-6" v-for="stream in ow">
          <div class="card">
          <div class="stream-text">{{ stream.title }}</div>
          <a :href="'http://twitch.tv/' + stream.thumbnail_url.slice(52, -21)"><img :src="stream.thumbnail_url.slice(0, stream.thumbnail_url.length - 20) + '250x150.jpg'"></a>
          <div class="stream-text" align="right">{{ stream.viewer_count }} viewers</div>
        </div>
        </div>
      </div>
  </div>
  `,
});


Vue.component('ow-stats', {
  props: ['stats'],
  template: `
    <div class="content">
    <div><h3>Offense: {{ Math.round(stats.filter(stream => stream.overwatch.broadcaster.hero.role === 'Offense').length / stats.length * 100) }}%</h3></div>
          <div><h3>Defense: {{ Math.round(stats.filter(stream => stream.overwatch.broadcaster.hero.role === 'Defense').length / stats.length * 100) }}%</h3></div>
          <div><h3>Tank: {{ Math.round(stats.filter(stream => stream.overwatch.broadcaster.hero.role === 'Tank').length / stats.length * 100) }}%</h3></div>
          <div><h3>Support: {{ Math.round(stats.filter(stream => stream.overwatch.broadcaster.hero.role === 'Support').length / stats.length * 100) }}% </h3></div>
  </div>
  `,
});

const vue = new Vue({
  el: '#app',
  data: {
    stats: [],
    ow: []
  },
  mounted () {
    this.getStreams();
    this.getOverwatch();
  },
  methods: {
    getStreams() {
      axios.get(baseURL + 'streams?game_id=488552&type=live&first=20&language=en')
      .then((response) => {
        console.log(response.data.data)
        this.ow = response.data.data;
      }).catch((error) => { console.log(error); });
    },
    getOverwatch() {
      axios.get(baseURL + 'streams/metadata?game_id=488552&type=live&first=100')
      .then(response => {
        this.stats = response.data.data.filter(stream => stream.game_id === '488552' && stream.overwatch.broadcaster.hero)
      })
      .catch(error => console.log(error))
    }
  }
});
