<template lang="html">
  <div class="app">
    <div class="topBar">
      user: username
    </div>

    <div class="filter">
      <input type="text" placeholder="关键字">
      <button type="button" name="button">添加</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>用户名</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Rx from 'rxjs';
import hub from '../data/hubs/main';

export default {
  data() {
    return {
      users: [{}],
    }
  },

  subscriptions() {
    return {
      state: hub.pipe('store.state')(),
    }
  },

  mounted() {
    //
  }
}
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.app {
  padding-top: 50px;
}

.topBar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 50px;
  background: #00d1b2;
  color: #fff;
  line-height: 30px;
  padding: 10px;
}

.filter {
  padding: 10px;
  width: 600px;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 4px;

  input {
    padding: 5px;
    line-height: 20px;
  }

  button {
    float: right;
    padding: 5px;
    line-height: 20px;
    cursor: pointer;
  }
}

table {
  width: 600px;
  margin: 20px auto;
  border: 1px solid #ddd;
  table-layout: fixed;
  border-collapse: collapse;

  td, th {
    padding: 5px;
    border: 1px solid #ddd;
  }

  th {
    background: #ccc;
  }
}
</style>
