import { Button, Fab, Paper, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import './App.css';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        toast.error('Please upload an image', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("The provided file couldn't be loaded as an Image media");
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  const isNumeric = (value) => {
    return /^-?\d+$/.test(value);
  }

  const handleResize = () => {
    if (isNumeric(height) && isNumeric(width) && parseInt(height) > 0 && parseInt(width) > 0){
      let cv = window.cv;
      let src = cv.imread('inputCanvas');
      let dst = new cv.Mat();
      let size = new cv.Size(parseInt(height), parseInt(width));
      cv.resize(src, dst, size, 0, 0, cv.INTER_AREA);
      cv.imshow('outputCanvas', dst);
      setCanDownload(true);
      src.delete(); dst.delete(); // to avoid memory leak
    } else {
      toast.error('Please enter valid dimensions', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    
  }

  const handleDownload = () => {
    var link = document.createElement('a');
    var name = imageName.substring(0, imageName.lastIndexOf("."));
    link.download = 'resized_' + name + ".png"; // using the same image name to download
    link.href = document.getElementById('outputCanvas').toDataURL("image/png");
    link.click();
  }

  return (
    <div className="app">
      <ToastContainer />
      <h1 className='heading'>Resize Image</h1>
      <Button className='uploadBtn' variant="contained" component="label" endIcon={<FileUploadIcon />}>
        {img == null ? "Upload Image" : "Upload new image"}
        <input hidden type="file" onChange={(e) => handleImage(e)} name="image" />
      </Button>
      <canvas id="inputCanvas"></canvas>
      {img != null &&
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }}>
            <Paper elevation={0}><TextField id="outlined-basic" label="New height" variant="outlined" value={height} onChange={(e) => setHeight(e.target.value)} /></Paper>
            <Paper elevation={0}><TextField id="outlined-basic" label="New width" variant="outlined" value={width} onChange={(e) => setWidth(e.target.value)} /></Paper>
            <Paper elevation={0}><Button size="large" variant="outlined" onClick={handleResize}>Resize</Button></Paper>
          </Stack>
          {canDownload && <h3 className="imageHeading">Resized Image</h3>}
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
