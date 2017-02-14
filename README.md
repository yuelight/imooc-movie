### 基于慕课网相关教程的电影CMS系统

---

##### 使用了Node Express Mongodb Jade构建

---

###### 启动

使用命令行至项目根目录
```
cd imooc-movie
```
下载相关模块
```
npm install
```
运行后台
```
gulp (or node app.js)
```

---

###### 路由规划
1. Index
    -  主页，显示电影的分类及各分类下的电影
    - signup用户注册 -- get请求
    - signin用户登录 -- get请求
    - lagout用户登出 -- get请求
    - movie:id电影详情页 -- get请求
2. User
    - commet评论 --get请求
    - signup用户注册 -- post请求
    - signin用户登录 -- post请求
    - comment用户评论保存 -- post请求
3. admin
    - user list用户列表显示 -- get请求
    - movie new电影新加页 -- get请求
    - movie update:id电影更新页 -- get请求
    - movie保存电影 -- post请求
    - movie list 电影列表显示 -- get请求
    - movie list 删除 -- delete
    - category new新增分类 -- get请求
    - category保存分类 -- post请求
    - category list分类列表显示 -- get请求
