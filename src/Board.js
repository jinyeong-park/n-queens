// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //iterate over what rowIndex to see if there's any existing 1's

      //console.log(rowIndex) => array

      var counter = 0;

      for (var i = 0; i < rowIndex.length; i++) {
        if (rowIndex[i] === 1) {
          counter++;
        }
        if (counter > 1) {
          return true;
        }
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {

      // console.log(this.rows());

      let flag = false;
      for (let i = 0 ;  i < this.rows().length; i++) {
        // if rows has conflict with current row, change flag to true;
        if (this.hasRowConflictAt(this.rows()[i])) {
          flag = true;
          break;
        }
      }
      return flag;
      // return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // console.log(colIndex);

      counter = 0;
      //iterate over the rows
      for (let i = 0; i < this.rows().length; i++) {
        if (this.rows()[i][colIndex] === 1) {
          counter++;
        }
        if (counter > 1 ) {
          return true;
        }
      }

      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      let flag = false;

      let board = this.rows();
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          //if (board[i][j] === 1)
          if (this.hasColConflictAt(this.rows()[i][j])) {
            flag = true;
            break;
          }
        }
      }
      return flag; // fixme
    },
    //if (this.hasRowConflictAt(this.rows()[i])) {


    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // index  <<   [0, 0]
      //  row++
      //  col++
      let rowIndex = majorDiagonalColumnIndexAtFirstRow[0];
      let colIndex = majorDiagonalColumnIndexAtFirstRow[1];

      console.log(rowIndex);
      console.log(colIndex);

      let count = 0;
      let board = this.rows();
      // [0, 0] [1, 1]
      for (let i = 0; i < board.length; i++) {

        if (board[rowIndex][colIndex] === 1) {
          count++;
        }

        if (count > 1) {
          return true;
        }

        rowIndex++;
        colIndex++;

        if (rowIndex >= board.length || colIndex >= board.length) {
          break;
        }
      }

      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
    // hasMajorDiagonalConflictAt([i, j])
      let board = this.rows();

      for (let i = 0; i < board.length; i++) {
        if (this.hasMajorDiagonalConflictAt([0, i])) {
          return true;
        }
      }
      for (let j = 1; j < board.length; j++) {
        if (this.hasMajorDiagonalConflictAt([j, 0])) {
          return true;
        }
      }
      return false; // fixme
    },


    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      let rowIndex = minorDiagonalColumnIndexAtFirstRow[0];
      let colIndex = minorDiagonalColumnIndexAtFirstRow[1];

      let counter = 0;
      let board = this.rows();

      for (let i = 0; i < board.length; i++) {
        if (board[rowIndex][colIndex] === 1) {
          counter++;
        }
        if (counter > 1) {
          return true;
        }
        rowIndex++;
        colIndex--;
        if (rowIndex >= board.length || colIndex < 0) {
          break;
        }

      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      let board = this.rows();

      for (let i = 0; i < board.length; i++) {
        if (this.hasMinorDiagonalConflictAt([0, i])) {
          return true;
        }
        if (this.hasMinorDiagonalConflictAt([i, board.length - 1])) {
          return true;
        }
      }
      return false; // fixme
    }


    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
