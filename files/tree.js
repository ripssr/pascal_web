'use strict';


const store = new Vuex.Store({
  state: {

    pascalData: {
      id: 1,
      name: ['Pascal programming', 'Программирование на Паскаль'],
      children: [
        {
          id: 2,
          name: ['Introduction', 'Введение'],
          children: [
            { 
              id: 3,
              name: ['What is programming?', 'Что такое программирование?']
            },
            {
              id: 4,
              name: ['About Pascal', 'О языке Паскаль']
            },
            {
              id: 5,
              name: ['Environment', 'Подготовка среды'],
              children: [
                  {
                    id: 6,
                    name: ['What is an Environment?', 'Что такое среда разработки?']
                  },
                  {
                    id: 7,
                    name: ['Compiller', 'Компилятор']
                  },
                  {
                    id: 8,
                    name: ['IDE', 'Среда разработки']
                  }
              ]
            },
            {
              id: 9,
              name: ['Yet another important stuff', 'Ещё немного важной информации']
            },
          ]
        },
        {
          id: 10,
          name: ['Basics', 'Основы'],
          children: [
            {
              id: 11,
              name: ['First Programm', 'Первая программа!']
            },
            {
              id: 12,
              name: ['Data types', 'Типы данных'],
              children: [
                {
                  id: 13,
                  name: ['Strings', 'Строки']
                }
              ]
            }
          ]
        }
      ]
    },

    lang: true,
    tree: true,
    currentId: 0,
    currentHeader: ['Welcome to the Pascal!', 'Добро пожаловать в Паскаль!'],
    currentArticle: ['', '']
  },
  getters: {

  },
  mutations: {
    switchLanguage: state => state.lang = !state.lang,
    toggleTree: state => state.tree = !state.tree,
    changeCurrentId: (state, id) => state.currentId = id,
    changeCurrentHeader: (state, title) => state.currentHeader = title,
    changeCurrentArticle: (state, article) => state.currentArticle = article,
  },
  actions: {
    switchLang: ({commit}) => commit('switchLanguage'),
    toggleTree: ({commit}) => commit('toggleTree'),
    changeCurrentId: ({commit}, id) => commit('changeCurrentId', id),
    changeCurrentHeader: ({commit}, title) => commit('changeCurrentHeader', title),
    changeCurrentArticle: ({commit}, id) => {
      fetch("files/article.php?article=" + id)
        .then(response => response.json())
          .then(response => commit('changeCurrentArticle', response))
    }
  }
});


Vue.component('item-component', {
  props: {
    model: Object,
    lang: Boolean
  },

  data() {
    return {
      open: false
    }
  },

  computed: {
    isFolder() {
      return this.model.children && this.model.children.length
    }
  },

  methods: {
    toggle() {
      if (this.isFolder) this.open = !this.open;
    },
    openArticle(model) {
      this.$store.dispatch('changeCurrentId', model.id);
      this.$store.dispatch('changeCurrentHeader', model.name);
      this.$store.dispatch('changeCurrentArticle', model.id);
    }
  },

  template: `
    <li>
      <div
        :class="{ bold: isFolder }"
        @click="toggle"
        @dblclick="openArticle(model)">{{ lang ? model.name[0] : model.name[1] }}<span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
      </div>
      <ul v-show="open" v-if="isFolder">
        <item-component
          class="item"
          v-for="(model, index) in model.children"
          :key="index"
          :model="model"
          :lang="lang" />
      </ul>
    </li>`
});


const header = new Vue({
  el: '#header-pascal',
  store,
  computed: Vuex.mapState({
    lang: state => state.lang,
    tree: state => state.tree,
  }),
  methods: Vuex.mapActions({
    changeLanguage: 'switchLang',
    toggleTree: 'toggleTree',
  }),
  template: `
    <header>
      <span class="header__title">{{ lang ? 'Pascal why not' : 'У нас Паскаль' }}</span>
      <ul class="header__menu">
        <li>
          <a @click="toggleTree">{{ lang ? tree ? 'Tree on' : 'Tree off' : tree ? 'Дерево' : 'Статья' }}</a>
        </li>
        <li>
          <a @click="changeLanguage">{{ lang ? 'English' : 'Русский'}}</a>
        </li>
        <li>
          <a href="https://github.com/ridj/pascal" target="_blank">{{ lang ? 'Github' : 'Гитхаб' }}</a>
        </li>
      </ul>
      <img class="header__logo" src="img/logo.png">
    </header>
  `
});


const pascal = new Vue({
  el: '#tree-of-content',
  store,
  computed: Vuex.mapState({
    pascal: state => state.pascalData,
    lang: state => state.lang,
    tree: state => state.tree
  }),
  methods: Vuex.mapActions({
    changeLanguage: 'switchLang'
  }),
  template: `
    <ul id="pascal-tree" v-show="tree">
      <item-component class="item" :model="pascal" :lang="lang" />
    </ul>
  `
});


const article = new Vue({
  el: '#article-pascal',
  store,
  computed: Vuex.mapState({
    lang: state => state.lang,
    articleId: state => state.currentId,
    header: state => state.currentHeader,
    article: state => state.currentArticle
  }),
  template: `
    <div id="article">
      <h2 class="article__title">{{ lang ? header[0] : header[1] }}</h2>
      <div class="article__body" v-html="lang ? article[0] : article[1]"></div>
    </div>
  `
});

