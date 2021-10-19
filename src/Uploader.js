import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuid } from 'uuid';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  width: 100%;
  min-height: 100vh;
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
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

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Image = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const Preview = styled.div`
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

const Description = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span:not(:last-child) {
    margin-right: 10px;
  }
`;

const Uploader = () => {
  const inputRef = useRef();
  const [fileList, setFileList] = useState([]);
  const dataTransfer = new DataTransfer();

  const handleChange = (e) => {
    const {
      target: { files: fileObject },
    } = e;

    const newFileList = [...fileList, ...Object.values(fileObject)];
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

  return (
    <Container>
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
  );
};

export default Uploader;
