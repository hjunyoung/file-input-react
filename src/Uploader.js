import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuid } from 'uuid';

const Container = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  width: 100%;
  min-height: 100vh;
  margin-top: 20px;

  ${(props) =>
    props.acceptable ||
    css`
      filter: blur(2px);
    `}
`;

const ButtonContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const button = css`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 120px;
  height: 30px;
  padding: 4px;

  background: #1177cc;
  font-size: 16px;
  font-weight: 700;

  border-radius: 5px;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
    filter: grayscale(0.2);
  }
`;

const Label = styled.label`
  ${button}
`;

const Reset = styled.button`
  ${button}
  border: 0;
`;

const Input = styled.input`
  /* opacity: 0;
  height: 0; */
`;

const DropBox = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 800px;
  height: 150px;
  background-color: #333333;
  border-radius: 5px;

  span {
    color: #ccc;
    opacity: 0.3;
    pointer-events: none;
  }

  &.dragover {
    box-shadow: inset 0px 0px 4px 4px rgba(0, 0, 0, 0.63);
    background-color: #555555;
  }
`;

const ImageContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Image = styled.article`
  display: flex;
  flex-direction: column;
  gap: 5px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const Preview = styled.section`
  width: 800px;
  height: 450px;
  background: #666666;
  border-radius: 5px;

  img {
    width: 800px;
    height: 450px;

    border-radius: 5px;
    object-fit: cover;
    object-position: center;
  }
`;

const Description = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span:not(:last-child) {
    margin-right: 10px;
  }

  button {
    width: 60px;
    height: 30px;

    background: #1177cc;
    border-radius: 2px;
    cursor: pointer;

    &:active {
      transform: scale(0.98);
      filter: grayscale(0.2);
    }
  }
`;

const Modal = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;

  width: 400px;
  height: 400px;

  font-size: 24px;
  font-weight: 700;
  color: #ddd;
  background-color: #444444;
  border-radius: 10px;
  text-align: center;

  button {
    width: 60px;
    height: 30px;
    font-weight: 700;
    color: #000;
    background-color: #e06464;

    &:hover {
      color: #e06464;
      background-color: #000;
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

const Uploader = () => {
  const inputRef = useRef();
  const dropRef = useRef();
  const [fileList, setFileList] = useState([]);
  const [acceptable, setAcceptable] = useState(true);
  const dataTransfer = new DataTransfer();

  const checkTypes = useCallback(
    (files) => {
      let newFileList = [...fileList, ...Object.values(files)];
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith('image')) {
          newFileList = fileList;
          setAcceptable(false);
          break;
        }
      }
      return newFileList;
    },
    [fileList]
  );

  useEffect(() => {
    const dropBox = dropRef.current;

    const dragEnter = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const dragLeave = (e) => {
      e.stopPropagation();
      e.preventDefault();
      e.target.classList.remove('dragover');
    };

    const dragOver = (e) => {
      e.stopPropagation();
      e.preventDefault();
      e.target.classList.add('dragover');
    };

    const drop = (e) => {
      e.stopPropagation();
      e.preventDefault();
      e.target.classList.remove('dragover');

      const files = e.dataTransfer.files;

      const newFileList = checkTypes(files);

      newFileList.forEach((file) => {
        dataTransfer.items.add(file);
      });

      inputRef.current.files = dataTransfer.files;

      setFileList(newFileList);
    };

    dropBox.addEventListener('dragenter', dragEnter);
    dropBox.addEventListener('dragleave', dragLeave);
    dropBox.addEventListener('dragover', dragOver);
    dropBox.addEventListener('drop', drop);

    return () => {
      dropBox.removeEventListener('dragenter', dragEnter);
      dropBox.removeEventListener('dragleave', dragLeave);
      dropBox.removeEventListener('dragover', dragOver);
      dropBox.removeEventListener('drop', drop);
    };
  }, [fileList, dataTransfer.files, dataTransfer.items, checkTypes]);

  const handleChange = (e) => {
    const {
      target: { files: fileObject },
    } = e;

    const newFileList = checkTypes(fileObject);

    // add each File object to dataTransferItemList object
    newFileList.forEach((file) => {
      dataTransfer.items.add(file);
    });

    // Set FileList object to dataTransfer.files (fileList object)
    inputRef.current.files = dataTransfer.files;

    setFileList(newFileList);
  };

  const handleReset = () => {
    setFileList([]);
    inputRef.current.value = '';
  };

  const deleteImage = (e) => {
    const {
      parentNode: {
        parentNode: { id: deleteId },
      },
    } = e.target;

    const newFileList = fileList.filter(
      (file) => file.lastModified !== Number(deleteId)
    );

    newFileList.forEach((file) => {
      dataTransfer.items.add(file);
    });

    inputRef.current.files = dataTransfer.files;

    setFileList(newFileList);
  };

  return (
    <>
      {acceptable || (
        <Modal>
          <span>You can only upload image files.</span>
          <button onClick={() => setAcceptable(true)}>OK</button>
        </Modal>
      )}
      <Container acceptable={acceptable}>
        <ButtonContainer>
          <Label htmlFor="input">Upload Image</Label>
          <Reset onClick={handleReset}>Reset</Reset>
        </ButtonContainer>
        <Input
          id="input"
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={true}
          onChange={handleChange}
        />
        <DropBox ref={dropRef}>
          <span>Drag and drop files here.</span>
        </DropBox>

        <ImageContainer>
          {fileList.length > 0 ? (
            fileList.map((file) => {
              const imageSrc = URL.createObjectURL(file);
              const id = uuid();

              return (
                <Image id={file.lastModified} key={id}>
                  <Description>
                    <div>
                      <span>File name: {file.name}</span>
                      <span>
                        File size: {`${(file.size / 2 ** 20).toFixed(1)}MB`}
                      </span>
                    </div>
                    <button onClick={deleteImage}>Delete</button>
                  </Description>
                  <Preview>
                    <img
                      src={imageSrc}
                      alt={file.name}
                      onLoad={() => URL.revokeObjectURL(imageSrc)}
                    />
                  </Preview>
                </Image>
              );
            })
          ) : (
            <span>No Image</span>
          )}
        </ImageContainer>
      </Container>
    </>
  );
};

export default Uploader;
