import './outputArea.scss';

const inputPressedKeyText = (event) => {
  const insertedValue = event.target.value;
  const textarea = event.target;

  textarea.value += insertedValue;
};

const TextareaComponent = (parentName, childName) => {
  const output = document.createElement(parentName);
  const element = document.createElement(childName);
  output.classList.add('output');
  element.classList.add('textarea');
  element.setAttribute('id', 'textarea');
  element.setAttribute('cols', '70');
  element.setAttribute('rows', '5');
  element.addEventListener('input', inputPressedKeyText);
  output.appendChild(element);

  return element;
};

export default TextareaComponent;
