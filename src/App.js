import {  useState } from 'react';
import './App.css';

const App = () => {

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [imageName, setImageName] = useState("");

  const handleImage = (e) => {
    var canvas = document.getElementById('inputCanvas');
    var ctx = canvas.getContext('2d');
    var reader = new FileReader();
    reader.onload = (event) => {
      var img = new Image();
      img.onload = () => {
        setImageName(e.target.files[0].name);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }
      img.onerror = () => {
        console.error("The provided file couldn't be loaded as an Image media");
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  const handleResize = () => {
    let cv = window.cv;
    let src = cv.imread('inputCanvas');
    let dst = new cv.Mat();
    let size = new cv.Size(parseInt(height), parseInt(width));
    cv.resize(src, dst, size, 0, 0, cv.INTER_AREA);
    cv.imshow('outputCanvas', dst);
    src.delete(); dst.delete(); // to avoid memory leak
  }

  const handleDownload = () => {
    var link = document.createElement('a');
    var name = imageName.substring(0, imageName.lastIndexOf("."));
    link.download = 'resized_' + name + ".png";
    link.href = document.getElementById('outputCanvas').toDataURL("image/png");
    link.click();
    link.delete();
  }

  return (
    <div className="App">
      <input type="file" onChange={(e) => handleImage(e)} name="image" />
      <canvas id="inputCanvas"></canvas>
      <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} />
      <input type="text" value={width} onChange={(e) => setWidth(e.target.value)} />
      <button type="button" onClick={handleResize}>Resize</button>
      <canvas id="outputCanvas"></canvas>
      <button type="button" onClick={handleDownload}>Download</button>
    </div>
  );
}

export default App;
