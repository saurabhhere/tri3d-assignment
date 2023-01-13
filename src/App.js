import { Button, Fab, TextField } from '@mui/material';
import { useState } from 'react';
import './App.css';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';

const App = () => {

  const [height, setHeight] = useState();
  const [width, setWidth] = useState();
  const [img, setImg] = useState();
  const [imageName, setImageName] = useState("");
  const [canDownload, setCanDownload] = useState(false);

  const handleImage = (e) => {
    var canvas = document.getElementById('inputCanvas');
    var ctx = canvas.getContext('2d');
    var reader = new FileReader();
    reader.onload = (event) => {
      var img = new Image();
      img.onload = () => {
        setImageName(e.target.files[0].name);
        setImg(img);
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
    setCanDownload(true);
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
    <div className="app">
      <h1 className='heading'>Resize Image</h1>
      <Button className='uploadBtn' variant="contained" component="label" endIcon={<FileUploadIcon />}>
        {img == null ? "Upload Image" : "Upload new image"}
        <input hidden type="file" onChange={(e) => handleImage(e)} name="image" />
      </Button>
      <canvas id="inputCanvas"></canvas>
      {img != null &&
        <>
          <div className='horizontalFlex'>
            <TextField id="outlined-basic" label="New height" variant="outlined" value={height} onChange={(e) => setHeight(e.target.value)} />
            <TextField id="outlined-basic" label="New width" variant="outlined" value={width} onChange={(e) => setWidth(e.target.value)} />
            <Button variant="outlined" onClick={handleResize}>Resize</Button>
          </div>
          {canDownload && <h3>Resized Image</h3>}
          <canvas id="outputCanvas"></canvas>

          {canDownload && <Fab onClick={handleDownload} color="primary" variant="extended">
            <DownloadIcon sx={{ mr: 1 }} />
            Download
          </Fab>}
        </>
      }

    </div>
  );
}

export default App;
