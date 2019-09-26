new Vue({
    el: '#app',
    data: {
      tableData:[],
      ceshi:[],
      message: 'Hello Vue!',
      navdata: [],
      yijcd: ["index.html", "product.html", "news.html", "case.html", "about.html"],
      webname: "",
      logosrc: "",
      productData: [],
      clientData: [],
      bootomInfo: [],
      getbotInfos:{},
      newsInfos:[],
      companydata:[],
      recruitdata:[],
      productsdata:[],
    },
    components: {
      "child-component": { //局部组件
        template: `
        <el-carousel :interval="5000" height="960px" arrow="always">
          <el-carousel-item v-for="item in lunImg" :key="item">
            <img style="width:100%;" :src="item.url" />
          </el-carousel-item>
        </el-carousel>
        `,
        data() {
          return {
            lunImg: []
          }
        },
        mounted() {
          axios.get('https://www.mangguo.info/api/imgconfig')
            .then(info => {
              //console.log(info)
              this.lunImg = info.data;
            })
        },
      }
    },
    mounted() {
      this.navgitab();
      // this.lunbos();
      this.headertop();
      this.logoImg();
      this.productDate();
      this.client();
      this.getbasisBootom();
      this.getbotInfo();
      //this.newsInfo();
      this.getCompany();
      this.recruitment();
      this.productshow();
    },
    methods: {
      navgitab() {
        axios.get('https://www.mangguo.info/api/navigat')
          .then(info => {
            this.navdata = info.data;
          })
      },
      headertop() {
        axios.get('https://www.mangguo.info/api/info')
          .then(info => {
            const infodata = info.data[0].webname;
            
          })
      },
      logoImg() {
        axios.get('https://www.mangguo.info/api/logoimg')
          .then(info => {
            //console.log(info)
            const logoImg = info.data.imglogo;
            this.logosrc = logoImg;
          })
      },
      productDate() {
        axios.get('https://www.mangguo.info/api/product')
          .then((result) => {
            //console.log(result.data)
            this.productData = result.data;
          }).catch((err) => {
            console.log(err)
          });
      },
      client() {
        axios.get('https://www.mangguo.info/api/client')
          .then(info => {
            //console.log(info)
            this.clientData = info.data
          })
      },
      getbasisBootom() {
        axios.get('https://www.mangguo.info/api/basisbottom')
          .then(info => {
            //console.log(info.data)
            this.bootomInfo = info.data;
          })
      },
      getbotInfo(){
        axios.get('https://www.mangguo.info/api/btominfo')
          .then(info => {
            //console.log(info.data)
            this.getbotInfos = info.data;
          })
      },
      //newsInfo(){
      //  axios.get('http://cms.mangguo.info/api/news')
      //    .then(info =>{
      //      //console.log(info);
      //      this.newsInfos = info.data;
      //    })
      //},
      getCompany(){
        axios.get('https://www.mangguo.info/api/company')
          .then( info => {
            //console.log(info)
            this.companydata = info.data;
          })
      },
      recruitment(){
        axios.get('https://www.mangguo.info/api/recruitment')
          .then(info => {
            //console.log(info)
            this.recruitdata = info.data;
          })
      },
      productshow(){
        axios.get('https://www.mangguo.info/api/productshow')
          .then( info => {
            console.log(info);
            this.productsdata = info.data;
          })
      }
    }
  })