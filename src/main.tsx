// Learn more at developers.reddit.com/docs
import { Devvit, useState, useInterval } from '@devvit/public-api';


Devvit.configure({
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add my post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    await reddit.submitPost({
      title: 'My devvit post',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Created post!' });
  },
});

// Add a post type definition
Devvit.addCustomPostType({  
  name: 'Experience Post',
  height: 'regular',
  render: (_context) => {
    const [counter, setCounter] = useState(1000);
    const [shape, setShape] = useState(0)
    const [shapeGrid, setShapeGrid] = useState([[1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 1, 1], [1, 1, 0, 0, 1, 1, 1, 1], [1, 0, 0, 0, 0, 1, 1, 1], [1, 0, 1, 1, 0, 1, 0, 0], [1, 1, 0, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0, 0]])
    const [fillClicks, setFillClicks] = useState(0)
    const [chosenColor, setChosenColor] = useState(-1)

    const updateInterval = useInterval(() => {
      setCounter((counter) => counter - 1);
    }, 1000);

    updateInterval.start();

    let alpha = 0.5
    if(counter % 2 == 1){
      alpha += 0.3
    }
    let alphaString1 = "rgba(0, 0, 0, 1)"
    let alphaString2 = "rgba(0, 0, 0, 1)"
    let alphaString3 = "rgba(0, 0, 0, 1)"
    let alphaString4 = "rgba(0, 0, 0, 1)"
    if(shape == 1){
      alphaString1 = "rgba(0, 0, 0, " + alpha + ")"
    }
    if(shape == 2){
      alphaString2 = "rgba(0, 0, 0, " + alpha + ")"
    }
    if(shape == 3){
      alphaString3 = "rgba(0, 0, 0, " + alpha + ")"
    }
    if(shape == 4){
      alphaString4 = "rgba(0, 0, 0, " + alpha + ")"
    }

    function isComplete(){
      let zeros = 0;
      let ones = 0;
      for(let i = 0; i < shapeGrid.length; i++){
        for(let j = 0; j < shapeGrid[i].length; j++){
          if(shapeGrid[i][j] == 0){
            zeros += 1;
          }
          if(shapeGrid[i][j] == 1){
            ones += 1;
          }
        }
      }
      if(zeros == 0 || ones == 0){
        return true
      } else {
        return false
      }
    }

    function placeShape(rowIndex: number, columnIndex: number){
      if(shape == 1){
        let newGrid = shapeGrid.slice()
        let originalColor = newGrid[rowIndex][columnIndex]
        if(chosenColor == -1 || newGrid[rowIndex][columnIndex] == chosenColor){
          newGrid[rowIndex][columnIndex] = 2
          setShapeGrid(newGrid)
          setFillClicks(fillClicks + 1)
          if(chosenColor == -1){
            setChosenColor(originalColor)
          }
        }
      }
      if(shape == 2){
        let newGrid = shapeGrid.slice()
        let originalColor = newGrid[rowIndex][columnIndex]
        if(chosenColor == -1 || newGrid[rowIndex][columnIndex] == chosenColor){
          if(newGrid[rowIndex][columnIndex] == newGrid[rowIndex][columnIndex + 1]){
            newGrid[rowIndex][columnIndex] = 2
            newGrid[rowIndex][columnIndex + 1] = 2
            setShapeGrid(newGrid)
            setFillClicks(fillClicks + 1)
            if(chosenColor == -1){
              setChosenColor(originalColor)
            }
          }
        }
      }
      if(shape == 3){
        let newGrid = shapeGrid.slice()
        let originalColor = newGrid[rowIndex][columnIndex]
        if(chosenColor == -1 || newGrid[rowIndex][columnIndex] == chosenColor){
          if(newGrid[rowIndex][columnIndex] == newGrid[rowIndex][columnIndex + 1] && newGrid[rowIndex][columnIndex] == newGrid[rowIndex + 1][columnIndex]){ 
            newGrid[rowIndex][columnIndex] = 2
            newGrid[rowIndex + 1][columnIndex] = 2
            newGrid[rowIndex][columnIndex + 1] = 2
            setShapeGrid(newGrid)
            setFillClicks(fillClicks + 1)
            if(chosenColor == -1){
              setChosenColor(originalColor)
            }
          }
        }
      }
      if(shape == 4){
        let newGrid = shapeGrid.slice()
        let originalColor = newGrid[rowIndex][columnIndex]
        if(chosenColor == -1 || newGrid[rowIndex][columnIndex] == chosenColor){
          if(newGrid[rowIndex][columnIndex] == newGrid[rowIndex + 1][columnIndex] && newGrid[rowIndex][columnIndex] == newGrid[rowIndex][columnIndex + 1] && newGrid[rowIndex][columnIndex] == newGrid[rowIndex + 1][columnIndex + 1]){ 
            newGrid[rowIndex][columnIndex] = 2
            newGrid[rowIndex + 1][columnIndex] = 2
            newGrid[rowIndex][columnIndex + 1] = 2
            newGrid[rowIndex + 1][columnIndex + 1] = 2
            setShapeGrid(newGrid)
            setFillClicks(fillClicks + 1)
            if(chosenColor == -1){
              setChosenColor(originalColor)
            }
          }
        }
      }
    }

    function newPicture(){
      setChosenColor(-1)
      setFillClicks(0)
      let newGrid = shapeGrid.slice()
      for(let i = 0; i < newGrid.length; i++){
        for(let j = 0; j < newGrid[i].length; j++){
          newGrid[i][j] = Math.floor(Math.random() * 2)
        }
      }
      setShapeGrid(newGrid)
    }

    return (
      <vstack height="100%" width="100%" gap="medium" alignment="center middle">
        <vstack>
          {
            shapeGrid.map((row, rowIndex) => {
              let columns = row.map((column, columnIndex) => {
                if(column == 1){
                  return <hstack onPress={() => placeShape(rowIndex, columnIndex)} backgroundColor="red" width="20px" height="20px"></hstack>
                } else if(column == 0) {
                  return <hstack onPress={() => placeShape(rowIndex, columnIndex)} backgroundColor="yellow" width="20px" height="20px"></hstack>
                } else {
                  return <hstack onPress={() => placeShape(rowIndex, columnIndex)} backgroundColor="black" width="20px" height="20px"></hstack>
                }
                
              })
              return <hstack>{columns}</hstack>
            })
          }
        </vstack>
        
          //Shapes
          {shape == 0 ? <text>Select a shape</text> : <text>Fill a color</text>}
          <hstack>
            <vstack onPress={() => {
                setShape(1)
              }} padding="small" backgroundColor="yellow">
              <vstack>
                <hstack>
                  <hstack backgroundColor={alphaString1} width="20px" height="20px"></hstack>
                  <hstack backgroundColor="white" width="20px" height="20px"></hstack>
                </hstack>
              </vstack>
              <vstack>
                <hstack>
                  <hstack backgroundColor="white" width="20px" height="20px"></hstack>
                  <hstack backgroundColor="white"  width="20px" height="20px"></hstack>
                </hstack>
              </vstack>
            </vstack>

            <vstack onPress={() => {
                setShape(2)
              }} padding="small" backgroundColor="yellow">
              <vstack>
                <hstack>
                  <hstack backgroundColor={alphaString2} width="20px" height="20px"></hstack>
                  <hstack backgroundColor={alphaString2} width="20px" height="20px"></hstack>
                </hstack>
              </vstack>
              <vstack>
                <hstack>
                  <hstack backgroundColor="white" width="20px" height="20px"></hstack>
                  <hstack backgroundColor="white"  width="20px" height="20px"></hstack>
                </hstack>
              </vstack>
            </vstack>

            <vstack onPress={() => {
                setShape(3)
              }} padding="small" backgroundColor="yellow">
              <vstack>
                <hstack>
                  <hstack backgroundColor={alphaString3} width="20px" height="20px"></hstack>
                  <hstack backgroundColor={alphaString3} width="20px" height="20px"></hstack>
                </hstack>
              </vstack>
              <vstack>
                <hstack>
                  <hstack backgroundColor={alphaString3} width="20px" height="20px"></hstack>
                  <hstack backgroundColor="white"  width="20px" height="20px"></hstack>
                </hstack>
              </vstack>
            </vstack>

            <vstack onPress={() => {
                setShape(4)
              }} padding="small" backgroundColor="yellow">
              <vstack>
                <hstack>
                  <hstack backgroundColor={alphaString4} width="20px" height="20px"></hstack>
                  <hstack backgroundColor={alphaString4} width="20px" height="20px"></hstack>
                </hstack>
              </vstack>
              <vstack>
                <hstack>
                  <hstack backgroundColor={alphaString4} width="20px" height="20px"></hstack>
                  <hstack backgroundColor={alphaString4}  width="20px" height="20px"></hstack>
                </hstack>
              </vstack>
            </vstack>
          </hstack>
          {isComplete() ? <hstack><text>Completed in {fillClicks} clicks</text><button onPress={() => newPicture()}>New Picture</button></hstack> : <text>Number of clicks {fillClicks}</text>}
      </vstack>
    );
  },
});

export default Devvit;
