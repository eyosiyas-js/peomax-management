import React from 'react'
import { Box, Button, Grid, useMediaQuery } from '@mui/material'
function Step3({ files }) {
  const [file, setFile] = React.useState([])
  const isMatch = useMediaQuery('(max-width:860px)')

  const handleImage = (e) => {
    setFile(e.target.files)
    files(e.target.files)
  }
  React.useEffect(() => {
    console.log(file)
  }, [file])
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  function ByteToKB(x) {
    let l = 0,
      n = parseInt(x, 10) || 0

    while (n >= 1024 && ++l) {
      n = n / 1024
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]
  }

  const [isDragOver, setIsDragOver] = React.useState(false)

  const handleDragEnter = (event) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragOver(false)

    const fileList = event.dataTransfer.files
    files(fileList)
  }
  return (
    <div style={{ width: '100%' }}>
      {isMatch ? (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              height: 'auto',
              paddingBottom: '20px',
              transform: 'translate(-50%, -50%)',
              width: '95%',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',

              borderRadius: '12px',
              borderColor: 'white',
            }}
          >
            <Grid
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <h5 style={{ marginTop: '45px', color: '#3F3E8D' }}>
                Uploaded an Images to your Restaurant
              </h5>
            </Grid>
            <h6
              style={{
                textAlign: 'start',
                width: '90%',
                marginTop: '20px',
              }}
            >
              Please select a pictures
            </h6>
            <Grid
              sx={{
                width: '90%',
                height: '150px',
                bgcolor: 'rgba(228, 232, 255, 0.3)',
                marginTop: '25px',
                border: '1px solid rgba(228, 232, 255, 0.9)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                id="input1"
              />

              {/* <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyHlhRBUevbh8DcWe7o5epTHj3PS0o7vsV1A&usqp=CAU"
                alt=""
                style={{ width: '80px' }}
              />

              <h4 style={{ color: 'gray', marginTop: '10px' }}>
                Drag and drop The files here
              </h4> */}
            </Grid>
            <Grid
              sx={{
                width: '70%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',

                marginTop: '20px',
              }}
            >
              {/* {selectedFiles.map((file) => (
                <h5 style={{ marginBottom: '10px' }}>
                  {`${files.indexOf(file) + 1}.  `}
                  {file.path}
                  <span style={{ marginLeft: '10px' }}>
                    {ByteToKB(file.size)}
                  </span>
                </h5>
              ))} */}
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              height: 'auto',
              paddingBottom: '30px',
              transform: 'translate(-50%, -50%)',
              width: 800,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              ml: '150px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',

              borderRadius: '12px',
              borderColor: 'white',
            }}
          >
            <Grid
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <h4 style={{ marginTop: '35px', color: '#3F3E8D' }}>
                Uploaded an Images to your Restaurant
              </h4>
            </Grid>
            <h5
              style={{
                textAlign: 'start',
                width: '90%',
                marginTop: '20px',
              }}
            >
              Please select a pictures
            </h5>
            <Grid
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              // style={{
              //   border: isDragOver ? '2px dashed red' : '2px dashed gray',
              //   padding: '20px',
              // }}
              sx={{
                width: '90%',
                height: '180px',
                marginTop: '25px',
                border: '1px solid rgba(228, 232, 255, 0.9)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyHlhRBUevbh8DcWe7o5epTHj3PS0o7vsV1A&usqp=CAU"
                alt=""
                style={{ width: '100px' }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                multiple
                id="input1"
              />
              <h4 style={{ color: 'gray', marginTop: '10px' }}>
                Choose your images here
              </h4>
            </Grid>
            <Grid
              sx={{
                width: '70%',
                display: 'flex',
                justifyContent: 'space-evenly',
                marginTop: '20px',
              }}
            >
              {/* {selectedFiles.map((file) => (
                <h5>
                  {`${selectedFiles.indexOf(file) + 1}.  `}
                  {file.path}
                  <span style={{ marginLeft: '10px' }}>
                    {ByteToKB(file.size)}
                  </span>
                </h5>
              ))} */}

              {/* <h5>
            2. Addis flyer.png <span style={{ marginLeft: "10px" }}>12kb</span>
          </h5> */}
            </Grid>
          </Box>
        </>
      )}
    </div>
  )
}

export default Step3
