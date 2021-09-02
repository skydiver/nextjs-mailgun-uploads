import React from 'react';
import axios from 'axios';

const Home = () => {
  const fileInputRef = React.useRef(null);
  const formRef = React.useRef(null);

  const onClickHandler = () => {
    fileInputRef.current?.click();
  };

  const onChange = async (formData) => {
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
      }
    };

    const response = await axios.post('/api/uploads', formData, config);

    console.log('response', response.data);
  };

  const onChangeHandler = (event) => {
    if (!event.target.files?.length) {
      return;
    }

    const formData = new FormData();

    Array.from(event.target.files).forEach((file) => {
      formData.append(event.target.name, file);
    });

    onChange(formData);

    formRef.current?.reset();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div>
        <form ref={formRef}>
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClickHandler}>
            Upload Single File
          </button>
          <input
            accept=""
            multiple={false}
            name="theFiles"
            onChange={onChangeHandler}
            ref={fileInputRef}
            style={{ display: 'none' }}
            type="file"
          />
        </form>
      </div>
    </div>
  );
};

export default Home;
