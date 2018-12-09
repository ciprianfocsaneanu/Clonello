<template>
  <div>
    <div class="page-title">
      {{ boardName }}
    </div>
    <b-container fluid>
      <b-row>
        <b-col cols="12" sm="6" md="4" lg="2" v-for="list in lists" :key="list.name" style="background: #E4F0F6; margin: 10px; border-radius: 20px;">
          <div style="margin: 20px 0">
            <div v-if="!list.inEditMode" class="list-title">
              {{ list.name }}
              <img src="../assets/edit.png" width="20px" style="cursor: pointer;" @click="listEditModeEnable(list, true)">
            </div>
            <div v-else>
              <input v-model="list.name">
              <img style="cursor: pointer" src="../assets/save.png" width="20px" @click="listEditModeEnable(list, false)">
              <img style="cursor: pointer" src="../assets/delete.png" width="20px" @click.exact="deleteList(list)">
            </div>
          </div>
          <b-card v-for="card in list.cards" :key="card.title" style="cursor: pointer; background: white; width: 100%; margin-bottom: 10px" @click="showModal(card)">
            <div class="card-title">
              {{card.title}}
            </div>
            <div>
              <b-modal hide-footer no-close-on-backdrop v-model="card.showModal">
                <div v-if="!card.inEditMode">
                  <div>
                    <span style="font-weight: bold"> Title: </span> 
                    {{ card.title }}
                  </div>
                  <div>
                    <span style="font-weight: bold"> Description: </span> 
                    {{ card.description }}
                  </div>
                  <img src="../assets/edit.png" width="20px" style="cursor: pointer;" @click="cardEditModeEnable(card, true)">
                </div>
                <div v-else>
                  <div style="margin-bottom: 10px">
                    <input v-model="card.title">
                  </div>
                  <div style="margin-bottom: 10px">
                    <input v-model="card.description">
                  </div>
                  <img style="cursor: pointer" src="../assets/save.png" width="20px" @click="cardEditModeEnable(card, false)">
                  <img style="cursor: pointer" src="../assets/delete.png" width="20px" @click.exact="deleteCard(list, card)">
                </div>
              </b-modal>
            </div>
          </b-card>
          <b-card style=" background: white; margin-bottom: 10px; height: 150px;">
            <div v-if="!list.inAddMode">
              <img src="../assets/add.png" width="40px" style="cursor: pointer; margin-top: 25px" @click="listAddCardModeEnable(list, true)">
            </div>
            <div v-else>
              <input v-model="newCardTitle" placeholder="Insert title" style="margin-bottom: 10px">
              <input v-model="newCardDescription" placeholder="Insert description" style="margin-bottom: 10px">
              <div class="absolute-center">
                <img style="cursor: pointer;display: block;" src="../assets/save.png" width="20px" @click="listAddCardModeEnable(list, false)">
              </div>
            </div>
          </b-card>
        </b-col>
        <b-col class="absolute-center" cols="12" sm="6" md="4" lg="2" style="background: #E4F0F6; margin: 10px; border-radius: 20px;">
            <div v-if="!addNewListMode">
              <img src="../assets/add.png" width="60px" style="cursor: pointer;" @click="addNewListModeEnable(true)">
            </div>
            <div v-else>
              <input v-model="newListName" placeholder="Insert name">
              <img style="cursor: pointer" src="../assets/save.png" width="20px" @click="addNewListModeEnable(false)">
            </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  boardsApi: "http://localhost:3000/boards",
  name: 'Board',
  data() {
    return {
      m_boardId: null,
      board: null,
      addNewListMode: false,
      newListName: '',
      newCardTitle: '',
      newCardDescription: ''
    };
  },
  computed: {
    boardId() {
      return this.m_boardId ? this.m_boardId : 'N/A';
    },
    lists() {
      if (this.board && this.board.lists) {
        return this.board.lists;
      }
      return [];
    },
    boardName() {
      if (this.board) {
        return this.board.name;
      }
      return '';
    }
  },
  created() {
    this.m_boardId = Number(this.$route.params.id);
    this.getBoard();
  },
  methods: {
    getBoard() {
      if (this.m_boardId) {
        this.$http.get(this.$options.boardsApi + '/' + this.m_boardId).then((response) => {
          if (response && response.status == 200 && response.data && response.data.length > 0) {
            this.board = response.data[0];
            for (let index = 0; index < this.board.lists.length; index++) {
              for(let cardIndex = 0; cardIndex < this.board.lists[index].cards.length; cardIndex++) {
                this.$set(this.board.lists[index].cards[cardIndex], 'showModal', false);
              }
            }
          }
        });
      }
    },
    updateBoard(newBoard) {
      this.$http.patch(this.$options.boardsApi + '/' + this.m_boardId, newBoard).then(() => {
        this.getBoard();
      });
    },
    addNewListModeEnable(value) {
      this.addNewListMode = value;
      if (!value && this.newListName && this.newListName.length > 0) {
        const newBoardData = this.board;
        newBoardData.lists.push({
            name: this.newListName,
            cards: []
        });
        this.newListName = '';
        this.updateBoard(newBoardData);
      }
    },
    listAddCardModeEnable(list, addModeEnabled) {
      if (list) {
        this.$set(list, 'inAddMode', addModeEnabled);
        if (!addModeEnabled && this.newCardTitle.length > 0) {
          for (let index = 0; index < this.board.lists.length; index ++) {
            if (this.board.lists[index].name == list.name) {
              this.board.lists[index].cards.push({
                title: this.newCardTitle,
                description: this.newCardDescription
              });
            }
          }
          this.newCardTitle = '';
          this.newCardDescription = '';
          this.updateBoard(this.board);
        }
      }
    },
    listEditModeEnable(list, editModeEnabled) {
      if (list) {
        this.$set(list, 'inEditMode', editModeEnabled);
        if (!editModeEnabled) {
          this.updateBoard(this.board);
        }
      }
    },
    deleteList(list) {
      const newLists = [];
      for (let index = 0; index < this.board.lists.length; index ++) {
        if (this.board.lists[index].name != list.name) {
          newLists.push(this.board.lists[index]);
        }
      }
      this.board.lists = newLists;
      this.updateBoard(this.board);
    },
    showModal (card) {
      this.$set(card, 'showModal', true);
    },
    cardEditModeEnable(card, editModeEnabled) {
      if (card) {
        this.$set(card, 'inEditMode', editModeEnabled);
        if (!editModeEnabled) {
          this.updateBoard(this.board);
        }
      }
    },
    deleteCard(list, card) {
      if (list && card) {
        const newCards = [];
        for (let listIndex = 0; listIndex < this.board.lists.length; listIndex ++) {
          if (this.board.lists[listIndex].name == list.name) {
            for (let cardIndex = 0; cardIndex < this.board.lists[listIndex].cards.length; cardIndex ++) {
              if (this.board.lists[listIndex].cards[cardIndex].title != card.title) {
                newCards.push({
                  title: this.board.lists[listIndex].cards[cardIndex].title,
                  description: this.board.lists[listIndex].cards[cardIndex].description
                });
              }
            }
            this.board.lists[listIndex].cards = newCards;
            break;
          }
        }
        this.$set(card, 'showModal', false);
        this.updateBoard(this.board);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.absolute-center {
   display: flex;
   align-items: center;
   justify-content: center;
}
.card-title {
  font-style: italic;
}
.list-title {
  font-weight: bold;
}
</style>
