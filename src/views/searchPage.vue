<template>
    <div class="search">
        <h1>{{ msg }}</h1>
        <p>category:{{ search.categoryIds}}</p>
        <p>industry:{{ search.industryIds}}</p>
        <ul>
            <li v-for="(category, index) in categoryList"
                :class="{active: category.selected}"
                :key="index"
                v-text="category.categoryName"
                @click="addCategory(category)"
            ></li>
        </ul>
        <ul>
            <li v-for="(industry, index) in industryList"
                :key="index"
                :class="{active: industry.selected}"
                v-text="industry.industryName"
                @click="addIndustry(industry)"
            ></li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'search',
        data () {
            return {
                msg: 'Welcome to Your Search.vue!',
                categoryList: [],   // 分类
                industryList: [],   // 行业
                search: {           // 搜索条件
                    categoryIds: '',
                    industryIds: ''
                }
            }
        },
        watch: {
            $route (to, from) {
                this.viewUpdate();
            }
        },
        methods: {
            viewUpdate () {
                var self = this;
                Promise.all([self.getCategory(), self.getIndustry()])
                    .then(self.setListData)
                    .then(self.getUrlParams)
                    .catch(function (error) {
                        console.error(error)
                    })
            },

            // 获取分类接口
            getCategory () {
                return this.axios.get('/mock/category.json');
            },

            // 获取行业接口
            getIndustry () {
                return this.axios.get('/mock/industry.json');
            },

            // 获取的分类与行业数据绑定
            setListData (data) {
                var self = this;

                self.categoryList = data[0].data;
                self.industryList = data[1].data;

                return self;
            },

            // 获取 url 上的参数 并赋值给 search
            getUrlParams () {
                var self = this;
                self.search.categoryIds = self.$route.query.categoryIds || '';
                self.search.industryIds = self.$route.query.industryIds || '';

                self.categoryList = self.categoryList.map(function (item) {
                    if (item.categoryId == self.search.categoryIds) { // url 上的分类默认被选中
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }

                    return item;
                })
                self.industryList = self.industryList.map(function (item) {

                    if (item.industryId == self.search.industryIds) { // url 上的行业默认被选中
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }

                    return item;
                })
                return self;
            },

            // 选择分类事件
            addCategory (list) {
                var self = this;

                self.categoryList = self.categoryList.map(function (item) {
                    item.selected = false;
                    return item
                });
                list.selected = true; // 被选中的分类高亮
                self.search.categoryIds = list.categoryId; // 设置 search
                self.setUrlParams(); // 写上 url
            },

            // 添加行业事件
            addIndustry (list) {
                var self = this;

                self.industryList = self.industryList.map(function (item) {
                    item.selected = false;
                    return item
                });

                list.selected = true;
                self.search.industryIds = list.industryId;
                self.setUrlParams();
            },

            // 写上 url
            setUrlParams () {
                var self = this;
                self.$router.push({
                    name: 'search',
                    query: {
                        categoryIds: self.search.categoryIds,
                        industryIds: self.search.industryIds,
                    }
                })

            }
        },
        mounted: function () {
            this.$nextTick(function () {
                var self = this;
                // vue 实例化 发送请求
                self.viewUpdate();
            })
        }
    }
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        font-size:14px;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
        padding:0 10px;
        height:30px;
        line-height:30px;
        cursor: pointer;
    }

    li.active{
        background: #01b5f3;
        border-radius: 5px;
        color: #fff;
    }

    a {
        color: #42b983;
    }
</style>
