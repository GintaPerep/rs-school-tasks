import './footer.scss';

const FooterComponent = (parentName, childName1, className1, childName2, className2) => {
  const element = document.createElement(parentName);
  const child1 = document.createElement(childName1);
  child1.classList.add(className1);
  child1.innerHTML = 'The keyboard was created in the Windows operating system';
  element.appendChild(child1);
  const child2 = document.createElement(childName2);
  child2.classList.add(className2);
  child2.innerHTML = 'To switch the language, you must use the manual keyboard with the combination:  left Ctrl + Alt';
  element.appendChild(child2);
  return element;
};

export default FooterComponent;
