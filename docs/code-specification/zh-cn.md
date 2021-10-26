# 代码规范

### 基础es6+语法规范

1. [Style Guide](https://bestofjs.org/projects/airbnb-style-guide)

2. [Clean Code](https://bestofjs.org/projects/clean-code)

### 代码命名规范，要求见名知意 （基础要求代码级注释，特殊业务添加注释说明）

命名规范： 驼峰命名

* fetch 函数命名规范

动词 + 名词

|  请求方式   |       函数前缀           |          举例              ｜         说明         ｜
|    ----   |          ----           |          -------           ｜         ------      ｜
|    GET    |       get / list        |      getUser / listUsers   |       获取用户信息     ｜
|    POST   |  create / submit / save |    createUser / submitUser  |      创建用户信息     ｜
|    PUT    |    update / modify      |    updateUser / modifyUser  |      更新用户信息     ｜
|    DELETE  |    del / delete        |    delUser / deleteUser     |      删除用户信息     ｜
|    xxx    |           xxx           |             xxx             |         其他扩展     ｜

* 事件函数命名规范

1. onXXXChange: onUserChange 主要涉及到表单控件事件命名。如果组件是明确的，如：UserSelect ,change事件可以简单命名为onChange（注：组件需要遵从单一职责规范）

2. 业务函数遵从“动词 + 名词”的命名规范：简单代码示例

```ts
bind/unbind + XXX   // bindUser, 绑定用户

disable/enable + XXX  // disableUser, 禁用用户
```

### vue3书写规范

```ts
// TODO: 
```