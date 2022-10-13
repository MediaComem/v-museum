<template>
  <div class="page-size">
    <Header :tag="'About'" />
    <el-row :gutter="20" :justify="'center'" style="margin: 5px;">
      <h3 class="text-title">
        Un projet conçu et développé par le Media Engineering Institute de la
        HEIG-VD et financé dans le cadre des programmes thématiques "Après
        COVID-19" de la HES-SO
      </h3>
    </el-row>
    <div class="logo">
      <div class="display-element">
        <img
          src="@/assets/about/Logo-ailleurs.svg"
          alt="ailleur"
        />
      </div>
      <div class="display-element">
        <img src="@/assets/about/Logo-HEIG-VD-MEI.svg" alt="mei" />
      </div>
      <div class="display-element">
        <img src="@/assets/about/Logo-HES-SO-Noir.svg" alt="hes" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../shared/components/Header.vue';

export default {
  name: 'About',
  components: { Header },
};
</script>

<style scoped>
.page-size {
  height: 100vh;
  width: 100vw;
}

.canvas-size {
  padding-top: 10vh;
  height: 80vh;
  width: 100vw;
}

.logo {
  width: 70vw;
  padding-left: 15vw;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
}

@media only screen and (min-width: 605px) {
  .display-element {
    flex: 1 1 23vw;
  }
}

@media only screen and (min-width: 300px) and (max-width: 369px) {
  .text-title {
    font-size: 20px;
    text-align: left;
    max-width: 35rem;
    padding-bottom: 10vh;
  }
}

@media only screen and (min-width: 370px) and (max-width: 699px) {
  .text-title {
    font-size: 20px;
    text-align: left;
    max-width: 35rem;
    padding-bottom: 10vh;
  }
}

@media only screen and (min-width: 700px) {
  .text-title {
    font-size: 30px;
    text-align: left;
    max-width: 35rem;
    padding-bottom: 10vh;
  }
}
</style>
