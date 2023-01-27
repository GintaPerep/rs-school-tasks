import './header.scss';

const HeaderComponent = (parentName, childName, className) => {
  const element = document.createElement(parentName);
  const child = document.createElement(childName);
  child.classList.add(className);
  child.innerHTML = 'RSS Virtual keyboard generated with Javascript';
  element.appendChild(child);
  return element;
};

export default HeaderComponent;
