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

    const width = element.width;
    const height = element.height;
    const outerFrame = 10;

    // o = none, 1 = white, 2 = black
    let colorState = 1;

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

    const onclick = e => {
      const cell = {
        top: Math.ceil((e.offsetY - outerFrame) / cellHeight) - 1,
        left: Math.ceil((e.offsetX - outerFrame) / cellWidth) - 1
      };

      if (vram[cell.top][cell.left] !== 0) return;
      vram[cell.top][cell.left] = colorState;

      checkReverse(cell, colorState);

      colorState = nextColor(colorState);

      renderStones(context, { cellHeight, cellWidth, outerFrame });
      title.textContent = "次は" + (colorState === 1 ? "白" : "黒") + "です";
    };

    element.addEventListener("click", onclick, false);
    element.addEventListener("dblclick", () => {}, false);
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
          { cellWidth, cellHeight, outerFrame, cell: { top, left } },
          state
        );
      })
    );
  };

  const renderStone = (
    context,
    { cellWidth, cellHeight, outerFrame, cell },
    colorState
  ) => {
    if (colorState === 0) return;
    context.beginPath();

    context.arc(
      outerFrame + cellWidth * (cell.left + 0.5),
      outerFrame + cellHeight * (cell.top + 0.5),
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

  const checkReverse = (cell, colorState) => {
    check(cell, colorState, {
      overCondition: "cell.top - i === -1",
      vramConditionA: "cell.top - i",
      vramConditionB: "cell.left"
    });

    check(cell, colorState, {
      overCondition: "cell.top + i === 8",
      vramConditionA: "cell.top + i",
      vramConditionB: "cell.left"
    });

    check(cell, colorState, {
      overCondition: "cell.left + i === 8",
      vramConditionA: "cell.top",
      vramConditionB: "cell.left + i"
    });

    check(cell, colorState, {
      overCondition: "cell.left - i === -1",
      vramConditionA: "cell.top",
      vramConditionB: "cell.left - i"
    });

    check(cell, colorState, {
      overCondition: "cell.top - i === -1",
      vramConditionA: "cell.top - i",
      vramConditionB: "cell.left - i"
    });

    check(cell, colorState, {
      overCondition: "cell.top - i === -1",
      vramConditionA: "cell.top - i",
      vramConditionB: "cell.left + i"
    });

    check(cell, colorState, {
      overCondition: "cell.top + i === 8",
      vramConditionA: "cell.top + i",
      vramConditionB: "cell.left + i"
    });

    check(cell, colorState, {
      overCondition: "cell.top + i === 8",
      vramConditionA: "cell.top + i",
      vramConditionB: "cell.left - i"
    });
  };

  const check = (
    cell,
    colorState,
    { overCondition, vramConditionA, vramConditionB }
  ) => {
    let a = 0;
    for (let i = 1; i < 8; ++i) {
      if (eval(overCondition)) break;

      if (
        vram[Number(eval(vramConditionA))][Number(eval(vramConditionB))] ===
        colorState
      ) {
        a = i;
        break;
      }

      if (
        vram[Number(eval(vramConditionA))][Number(eval(vramConditionB))] === 0
      )
        break;
    }

    for (let i = 1; i < a; i++) {
      vram[Number(eval(vramConditionA))][
        Number(eval(vramConditionB))
      ] = colorState;
    }
  };

  const nextColor = i => (i === 1 ? 2 : 1);
}
