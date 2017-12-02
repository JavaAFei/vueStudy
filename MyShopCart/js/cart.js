var vue = new Vue({
    el:"#app",
    data:{
        totalPrice:0,
        productList:[

        ],
        checkedAll:false,
        showDelete:false,
        curProduct:''
    },
    filters:{
        money:function (value,type) {
            return "￥"+value.toFixed(2)+" 元"
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.cardView();
        })
    },
    methods:{
        cardView:function () {
            var _this = this;
            axios.get('data/cartData.json')
                .then(function (response) {
                    _this.productList = response.data.result.list;
                    _this.totalPrice = response.data.result.totalMoney;
                })
        },
        calcuPrice:function (product,type) {
            if(typeof product.productQuantity != 'number' || product.productQuantity<1){
                product.productQuantity=1;
            }
            if(product.productQuantity>1 || type==1){
                product.productQuantity=parseInt(product.productQuantity)+type;
            }
            var totalPrice = 0;
            this.productList.forEach(function (product) {
                if(product.checked){
                    totalPrice += product.productQuantity*product.productPrice;
                }
            });
            vue.totalPrice = totalPrice;
        },
        selectProduct:function (product) {
            if(typeof product.checked == 'undefined'){
                this.$set(product,"checked",true);
            }else{
                product.checked=!product.checked;
            }

            var flag = true;
            this.productList.forEach(function (product) {
                flag = product.checked==true?flag:false;
            });
            this.checkedAll=flag;

            this.calcuPrice(product,0);
        },
        selectAll:function (flag) {
            this.checkedAll=flag;
            this.productList.forEach(function (product) {
                if(typeof product.checked == 'undefined'){
                    vue.$set(product,"checked",flag);
                }else{
                    product.checked = flag;
                }
            })
        },
        delProduct:function () {
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index,1);
            this.showDelete=false;
        }
    }
})

Vue.filter('money',function (value,type) {
    return "$"+value.toFixed(2)+" 美元"
})