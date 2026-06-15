import { useState, useEffect } from 'react';

/**
 * LocalStorage와 동기화되는 커스텀 훅
 * @param {string} key - LocalStorage 키 이름
 * @param {*} initialValue - 키가 없을 때 사용할 초기값
 * @returns {[*, Function]} - [현재 값, 값을 설정하는 함수]
 */
function useLocalStorage(key, initialValue) {
  // 초기 state를 LocalStorage에서 읽어오거나 initialValue 사용
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`LocalStorage 읽기 오류 (key: ${key})`, error);
      return initialValue;
    }
  });

  // storedValue가 바뀔 때마다 LocalStorage에 자동 저장
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`LocalStorage 저장 오류 (key: ${key})`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
