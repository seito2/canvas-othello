{
  let vram = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  window.onload = () => {
    const element = document.getElementById("canvas");
    const title = document.getElementById("title");
    const status = document.getElementById("status");
    const alert = document.getElementById("alert");
    const pass = document.getElementById("pass");

    const width = element.width;
    const height = element.height;
    const outerFrame = 10;

    // o = none, 1 = white, 2 = black
    let colorState = 2;

    title.textContent = "次は" + (colorState === 1 ? "白" : "黒") + "です";

    const context = element.getContext("2d");

    const cellHeight = (height - outerFrame * 2) / 8;
    const cellWidth = (width - outerFrame * 2) / 8;

    renderBackground(context, { width, height, outerFrame });

    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        renderLine(
          context,
          { width, height },
          { top: i * cellHeight + outerFrame, left: j * cellWidth + outerFrame }
        );
      }
    }

    renderStones(context, { cellHeight, cellWidth, outerFrame });
    status.textContent = "白：2 黒：２";

    const onclick = e => {
      const top = Math.ceil((e.offsetY - outerFrame) / cellHeight) - 1;
      const left = Math.ceil((e.offsetX - outerFrame) / cellWidth) - 1;

      if (vram[top][left] !== 0) return;
      if (!canPutStone(top, left, colorState)) {
        alert.textContent = "そこはおけないよ";
        return;
      }

      alert.textContent = "　";
      vram[top][left] = colorState;

      checkReverse(top, left, colorState);
      const { emptyCell, whiteCell, blackCell } = countStones();

      if (emptyCell === 0) {
        status.textContent = "終了〜";
        return;
      }

      status.textContent = `白：${whiteCell} 黒：${blackCell}`;

      colorState = nextColor(colorState);

      renderStones(context, { cellHeight, cellWidth, outerFrame });
      title.textContent = "次は" + (colorState === 1 ? "白" : "黒") + "です";
    };

    element.addEventListener("click", onclick, false);
    element.addEventListener("dblclick", () => {}, false);
    pass.addEventListener("click", () => {
      colorState = nextColor(colorState);
      title.textContent = "次は" + (colorState === 1 ? "白" : "黒") + "です";
    });
  };

  const renderBackground = (context, { height, width, outerFrame }) => {
    context.beginPath();

    context.rect(0, 0, height, width);

    context.fillStyle = "#00AA00";
    context.fill();
    context.strokeStyle = "black";
    context.lineWidth = outerFrame;

    context.stroke();
  };

  const renderLine = (context, { height, width }, { top, left }) => {
    context.beginPath();

    context.rect(top, left, (height - 20) / 8, (width - 20) / 8);
    context.strokeStyle = "black";
    context.lineWidth = 2;

    context.stroke();
  };

  const renderStones = (context, { cellWidth, cellHeight, outerFrame }) => {
    vram.map((literalDirection, top) =>
      literalDirection.map((state, left) => {
        renderStone(
          context,
          { cellWidth, cellHeight, outerFrame, top, left },
          state
        );
      })
    );
  };

  const renderStone = (
    context,
    { cellWidth, cellHeight, outerFrame, top, left },
    colorState
  ) => {
    if (colorState === 0) return;
    context.beginPath();

    context.arc(
      outerFrame + cellWidth * (left + 0.5),
      outerFrame + cellHeight * (top + 0.5),
      (cellWidth - 10) / 2,
      0,
      Math.PI * 2
    );

    context.fillStyle = colorState === 1 ? "white" : "black";
    context.fill();
    context.strokeStyle = colorState === 1 ? "white" : "black";

    context.lineWidth = 0.0001;

    context.stroke();
  };

  const checkReverse = (top, left, colorState) => {
    let a = 0;
    a = checkMethods.up(top, left, colorState);
    for (let i = 1; i < a; i++) {
      vram[top - i][left] = colorState;
    }

    a = 0;
    a = checkMethods.down(top, left, colorState);
    for (let i = 1; i < a; i++) {
      vram[top + i][left] = colorState;
    }

    a = 0;
    a = checkMethods.right(top, left, colorState);
    for (let i = 1; i < a; i++) {
      vram[top][left + i] = colorState;
    }

    a = 0;
    a = checkMethods.left(top, left, colorState);
    for (let i = 1; i < a; i++) {
      vram[top][left - i] = colorState;
    }

    a = 0;
    a = checkMethods.leftUpper(top, left, colorState);
    for (let i = 1; i < a; i++) {
      vram[top - i][left - i] = colorState;
    }

    a = 0;
    a = checkMethods.rightUpper(top, left, colorState);
    for (let i = 1; i < a; i++) {
      vram[top - i][left + i] = colorState;
    }

    a = 0;
    a = checkMethods.diagonallyDownRight(top, left, colorState);
    for (let i = 1; i < a; i++) {
      vram[top + i][left + i] = colorState;
    }

    a = 0;

    a = checkMethods.diagonallyDownLeft(top, left, colorState);
    for (let i = 1; i < a; i++) {
      vram[top + i][left - i] = colorState;
    }
  };

  const nextColor = i => (i === 1 ? 2 : 1);

  const checkMethods = {
    up: (top, left, colorState) => {
      let a = 0;
      for (let i = 1; i < 8; ++i) {
        if (top - i === -1) break;
        if (vram[top - i][left] === colorState) {
          a = i;
          break;
        }
        if (vram[top - i][left] === 0) break;
      }
      return a === 1 ? 0 : a;
    },

    down: (top, left, colorState) => {
      let a = 0;
      for (let i = 1; i < 8; ++i) {
        if (top + i === 8) break;
        if (vram[top + i][left] === colorState) {
          a = i;
          break;
        }
        if (vram[top + i][left] === 0) break;
      }
      return a === 1 ? 0 : a;
    },

    right: (top, left, colorState) => {
      let a = 0;
      for (let i = 1; i < 8; ++i) {
        if (left + i === 8) break;
        if (vram[top][left + i] === colorState) {
          a = i;
          break;
        }
        if (vram[top][left + i] === 0) break;
      }
      return a === 1 ? 0 : a;
    },

    left: (top, left, colorState) => {
      let a = 0;
      for (let i = 1; i < 8; ++i) {
        if (left - i === -1) break;
        if (vram[top][left - i] === colorState) {
          a = i;
          break;
        }
        if (vram[top][left - i] === 0) break;
      }

      return a === 1 ? 0 : a;
    },

    leftUpper: (top, left, colorState) => {
      let a = 0;
      for (let i = 1; i < 8; ++i) {
        if (top - i === -1) break;
        if (vram[top - i][left - i] === colorState) {
          a = i;
          break;
        }
        if (vram[top - i][left - i] === 0) break;
      }
      return a === 1 ? 0 : a;
    },

    rightUpper: (top, left, colorState) => {
      let a = 0;
      for (let i = 1; i < 8; ++i) {
        if (top - i === -1) break;
        if (vram[top - i][left + i] === colorState) {
          a = i;
          break;
        }
        if (vram[top - i][left + i] === 0) break;
      }
      return a === 1 ? 0 : a;
    },

    diagonallyDownLeft: (top, left, colorState) => {
      let a = 0;
      for (let i = 1; i < 8; ++i) {
        if (top + i === 8) break;
        if (vram[top + i][left - i] === colorState) {
          a = i;
          break;
        }
        if (vram[top + i][left - i] === 0) break;
      }
      return a === 1 ? 0 : a;
    },

    diagonallyDownRight: (top, left, colorState) => {
      let a = 0;
      for (let i = 1; i < 8; ++i) {
        if (top + i === 8) break;
        if (vram[top + i][left + i] === colorState) {
          a = i;
          break;
        }
        if (vram[top + i][left + i] === 0) break;
      }
      return a === 1 ? 0 : a;
    }
  };

  const canPutStone = (top, left, colorState) =>
    checkMethods.up(top, left, colorState) !== 0 ||
    checkMethods.down(top, left, colorState) !== 0 ||
    checkMethods.right(top, left, colorState) !== 0 ||
    checkMethods.left(top, left, colorState) !== 0 ||
    checkMethods.leftUpper(top, left, colorState) !== 0 ||
    checkMethods.rightUpper(top, left, colorState) !== 0 ||
    checkMethods.diagonallyDownLeft(top, left, colorState) !== 0 ||
    checkMethods.diagonallyDownRight(top, left, colorState) !== 0;

  const countStones = () => {
    let emptyCell = 0;
    let whiteCell = 0;
    let blackCell = 0;
    vram.map(a =>
      a.map(b => (b === 0 ? ++emptyCell : b === 1 ? ++whiteCell : ++blackCell))
    );
    return { emptyCell, whiteCell, blackCell };
  };
}
