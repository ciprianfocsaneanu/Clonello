<template>
  <div>
    <div class="page-title">
      Boards
    </div>
    <b-container fluid>
      <b-row>
        <b-col style="margin-bottom: 20px" cols="12" sm="6" md="4" lg="2" v-for="board in boards" :key="board._id">
          <b-card @click="redirectToBoardPage(board)" style="cursor: pointer; background: white; height: 70px;"> 
            <div v-if="!board.inEditMode" style="font-weight: bold">
              {{board.name}}
              <img style="cursor: pointer" src="../assets/edit.png" width="20px" @click.exact="editModeChanged(board, true)">
            </div>
            <div v-else @click.stop>
              <input v-model="board.name" @blur="editModeChanged(board, false)">
              <img style="cursor: pointer" src="../assets/save.png" width="20px" @click.exact="editModeChanged(board, false)">
              <img style="cursor: pointer" src="../assets/delete.png" width="20px" @click.exact="deleteBoard(board)">
            </div>
          </b-card>
        </b-col>
        <b-col style="margin-bottom: 20px" cols="12" sm="6" md="4" lg="2">
          <b-card style="background: white; height: 70px;">
            <div v-if="!addNewEnabled">
              <img style="cursor: pointer" src="../assets/add.png" width="25px" @click="switchAddNewEnabled()">
            </div>
            <div v-else>
              <input v-model="newBoardName" placeholder="Insert name" @blur="addNewBoard()">
              <img style="cursor: pointer" src="../assets/save.png" width="20px" @click="addNewBoard()">
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  boardsApi: "http://localhost:3000/boards",
  name: 'Dashboard',
  data() {
    return {
      m_boards: [],
      addNewEnabled: false,
      newBoardName: ''
    };
  },
  created() {
    this.getBoards();
  },
  computed: {
    boards() {
      return this.m_boards;
    }
  },
  methods: {
    getBoards() {
      this.$http.get(this.$options.boardsApi).then((response) => {
        if (response && response.status == 200 && response.data) {
          this.m_boards = response.data;
        }
      });
    },
    editModeChanged(board, editModeEnabled) {
      this.$set(board, 'inEditMode', editModeEnabled);
      if (!editModeEnabled) {
        this.updateBoard(board);
      }
    },
    updateBoard(board) {
      if (board && board._id) {
        this.$http.patch(this.$options.boardsApi + '/' + board._id, board);
      }
    },
    switchAddNewEnabled() {
      this.addNewEnabled = !this.addNewEnabled;
    },
    addNewBoard() {
      this.switchAddNewEnabled();
      if (this.newBoardName && this.newBoardName.length > 0) {
        const newBoard = {
          name: this.newBoardName,
          lists: []
        };
        this.$http.post(this.$options.boardsApi, newBoard).then(() => {
          this.getBoards();
        });
        this.newBoardName = '';
      }
    },
    redirectToBoardPage(board) {
      if (board && !board.inEditMode) {
        this.$router.push({
            path: '/board/' + board._id
          }
        );
      }
    },
    deleteBoard(board) {
      if (board && board._id) {
        this.$http.delete(this.$options.boardsApi + '/' + board._id, board).then(() => {
          this.getBoards();
        });
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
