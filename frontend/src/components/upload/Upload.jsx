import React, { useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * `Upload` 是一個上傳元件。幫助我們能夠發佈文字、圖片、影片、檔案到後端伺服器上。
*/
const Upload = ({
  resetKey,
  children,
  onChange,
  ...props
}) => {
  const inputFileRef = useRef();

  const handleOnClickUpload = () => {
    inputFileRef.current.click();
  };

  const handleOnChange = (event) => {
    if (typeof onChange === 'function') {
      onChange(event?.target?.files);
    }
  };

  return (
    <>
      <input
        key={resetKey}
        ref={inputFileRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleOnChange}
        {...props}
      />
      {
        React.cloneElement(children, {
          onClick: handleOnClickUpload,
        })
      }
    </>
  );
};

Upload.propTypes = {
  /**
   * 重設鍵值，鍵值被改變時 input value 會被重設
   */
  resetKey: PropTypes.number,
  /**
   * 限制檔案類型
   */
  accept: PropTypes.string,
  /**
   * 是否選取多個檔案
   */
  multiple: PropTypes.bool,
  /**
   * 選取上傳檔案時的 callback
   */
  onChange: PropTypes.func,
  /**
   * 內容，這邊指的是上傳按鈕外觀
   */
  children: PropTypes.element.isRequired,
};

Upload.defaultProps = {
  resetKey: 0,
  accept: undefined,
  multiple: false,
  onChange: () => {},
};

export default Upload;