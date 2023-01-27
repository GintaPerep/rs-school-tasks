import HeaderComponent from '../Header/HeaderComponent';
import TextareaComponent from '../Textarea/TextareaComponent';
import './keyboardBody.scss';
import { keysObject } from './keys-config';

import FooterComponent from '../Footer/FooterComponent';

class KeyboardJs {
  constructor() {
    this.element = null;

    this.textarea = null;

    this.state = {
      isShiftLeftPressed: false,
      isShiftRightPressed: false,
      isCapsLockPressed: false,
      case: 'caseDown',
      lang: 'eng',
    };

    this.current = {
      element: null,
      code: null,
      event: null,
      char: null,
    };

    this.previous = {
      element: null,
      code: null,
      event: null,
      char: null,
    };
  }

  initKeyboard() {
    /* ---- ROOT START---- */
    const divRoot = document.createElement('div');
    divRoot.setAttribute('id', 'root');
    /* ---- ROOT END ---- */

    /* ---- HEADER  START---- */
    const header = HeaderComponent('header', 'h1', 'headerTitle');
    divRoot.appendChild(header);
    /* ---- HEADER END---- */

    /* ---- TEXTAREA  START---- */
    const output = TextareaComponent('div', 'textarea');
    this.textarea = output;
    divRoot.appendChild(output);
    /* ---- TEXTAREA  END---- */

    const keysSection = this.keyGenerator(keysObject.KEYS_CONFIG);

    divRoot.appendChild(keysSection);

    document.body.appendChild(divRoot);

    document.addEventListener('keyup', this.keyUpHandler.bind(this));
    document.addEventListener('keydown', this.keyDownHandler.bind(this));
    document.addEventListener('keyup', this.toggleCapsLock.bind(this));
    document.addEventListener('keydown', this.languageSwitch.bind(this));
    divRoot.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    divRoot.addEventListener('mousedown', this.mouseDownHandler.bind(this));

    /* ---- FOOTER  START---- */
    const footer = FooterComponent('footer', 'p', 'footerTitle', 'p', 'language');
    divRoot.appendChild(footer);
    /* ---- FOOTER END---- */
    this.initLang();
  }

  mouseDownHandler(e) {
    this.current.element = e.target.closest('div');
    if (this.current.element.classList.contains('Space')) {
      this.btnDown();
      return;
    }
    if (e.target.tagName !== 'SPAN') {
      return;
    }
    this.current.event = e;
    this.current.code = e.target.innerHTML;

    if (this.current.element) {
      this.current.char = e.target.innerHTML;
      this.toggleCapsLock(this.current.char);
      if (this.current.char !== 'CapsLock') {
        this.specialKeysHandler(this.current.char);
        if (!keysObject.FN_BTN.includes(this.current.char)) {
          if (!keysObject.FN_Mouse.includes(this.current.char)) {
            this.inputText(this.current.char);
          }
        }
      }
      if (this.current.char === 'Shift') {
        if (this.state.isShiftLeftPressed === false) {
          this.addActiveState();
          this.state.isShiftLeftPressed = true;
        } else {
          this.state.isShiftLeftPressed = false;
          this.removeActiveState();
        }
        this.toggleKeysCase();
      } else {
        this.toggleKeysCase();
        this.btnDown();
      }
    }
  }

  mouseUpHandler(e) {
    this.current.element = e.target.closest('div');
    this.current.event = e;

    if (this.current.element.classList.contains('ShiftLeft')) {
      const shiftLeftElement = e.target.parentElement.closest('div').parentElement.getElementsByClassName('ShiftRight');
      if (shiftLeftElement[0].classList.contains('active')) {
        shiftLeftElement[0].classList.remove('active');
      }
    }
    if (this.current.element.classList.contains('ShiftRight')) {
      const shiftRightElement = e.target.parentElement.closest('div').parentElement.getElementsByClassName('ShiftLeft');
      if (shiftRightElement[0].classList.contains('active')) {
        shiftRightElement[0].classList.remove('active');
      }
    }
    this.btnUp();
    if (this.current.element.classList.contains('Space')) {
      this.current.char = this.current.element.querySelectorAll(':not(.hidden)')[1].textContent;
      this.inputText(this.current.char);
      this.btnUp();
    }
  }

  keyGenerator(keys) {
    const keyboardBody = document.createElement('div');
    keyboardBody.classList.add('keyboardBody');
    this.element = keyboardBody;
    const fragment = document.createDocumentFragment();

    for (let k = 0; k < keys.length; k += 1) {
      const keyboardRow = document.createElement('div');
      keyboardRow.classList.add('keyboardRow');
      for (let j = 0; j < keys[k].length; j += 1) {
        const keyElement = document.createElement('div');
        keyElement.classList.add('keyboard--key', 'key', keys[k][j].className);

        const spanRus = document.createElement('span');
        spanRus.classList.add('rus', 'hidden');
        spanRus.insertAdjacentHTML('afterBegin', `<span class="caseDown hidden">${keys[k][j].rus.caseDown}</span>`);
        spanRus.insertAdjacentHTML('beforeEnd', `<span class="caseUp hidden">${keys[k][j].rus.caseUp}</span>`);
        spanRus.insertAdjacentHTML('beforeEnd', `<span class="caps hidden">${keys[k][j].rus.caps || keys[k][j].rus.caseUp}</span>`);
        spanRus.insertAdjacentHTML('beforeEnd', `<span class="shiftCaps hidden">${keys[k][j].rus.shiftCaps || keys[k][j].rus.caseDown}</span>`);
        keyElement.appendChild(spanRus);

        const spanEng = document.createElement('span');
        spanEng.classList.add('eng');
        spanEng.insertAdjacentHTML('afterBegin', `<span class="caseDown">${keys[k][j].eng.caseDown}</span>`);
        spanEng.insertAdjacentHTML('beforeEnd', `<span class="caseUp hidden">${keys[k][j].eng.caseUp}</span>`);
        spanEng.insertAdjacentHTML('beforeEnd', `<span class="caps hidden ">${keys[k][j].eng.caps || keys[k][j].eng.caseUp}</span>`);
        spanEng.insertAdjacentHTML('beforeEnd', `<span class="shiftCaps hidden">${keys[k][j].eng.shiftCaps || keys[k][j].eng.caseDown}</span>`);
        keyElement.appendChild(spanEng);

        keyboardRow.appendChild(keyElement);
      }
      fragment.appendChild(keyboardRow);
    }
    keyboardBody.appendChild(fragment);
    return keyboardBody;
  }

  keyUpHandler(e) {
    const pressedButton = this.element.getElementsByClassName(e.code)[0];
    // if pressedButton is not empty then set the as current element
    if (pressedButton) {
      this.current.element = pressedButton.closest('div');
      this.turnOffHighLightPressedButton();
    }
    switch (e.code) {
      case 'ShiftLeft':
        if (this.state.isCapsLockPressed) {
        // make all letter caseUP
          this.state.isShiftLeftPressed = false;
          this.toggleKeysCase();
          this.btnUp();
        } else {
          this.state.isShiftLeftPressed = false;
          this.toggleKeysCase();
          this.btnUp();
        }
        break;
      case 'ShiftRight':
        if (this.state.isCapsLockPressed) {
        // make all letter caseUP
          this.state.isShiftRightPressed = false;
          this.toggleKeysCase();
          this.btnUp();
        } else {
          this.state.isShiftRightPressed = false;
          this.toggleKeysCase();
          this.btnUp();
        }
        break;
      case 'Backspace':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'Delete':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'Tab':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'Enter':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'AltRight':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'AltLeft':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'ControlRight':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'ControlLeft':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'MetaLeft':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'ArrowUp':
        if (!keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'ArrowDown':
        if (!keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'ArrowLeft':
        if (!keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
      case 'ArrowRight':
        if (!keysObject.FN_BTN.includes(e.code)) {
          this.btnUp();
        }
        break;
         // no default
    }
  }

  inputText(inputKey) {
    const textareaValue = this.textarea.value;
    const selectionStartIndex = this.textarea.selectionStart;
    let slicedText = '';

    const insertedValue = inputKey;
    if (selectionStartIndex >= 0 && selectionStartIndex <= textareaValue.length) {
    // slice text of the cursor position LEFT side
      slicedText += textareaValue.slice(0, selectionStartIndex);
      // add current pressed key at selected start cursor position
      slicedText += this.current.char;
      // slice text of the cursor position RIGHT side
      slicedText += textareaValue.slice(selectionStartIndex, textareaValue.length);
      // input combined text to text area
      this.textarea.value = slicedText;
      this.textarea.selectionStart = selectionStartIndex + this.current.char.length;
      this.textarea.selectionEnd = selectionStartIndex + this.current.char.length;
    } else {
      this.textarea.value += insertedValue;
    }
  }

  specialKeysHandler(e) {
    const keyCode = e.code || e;
    const textareaValue = this.textarea.value;
    const selectionStartIndex = this.textarea.selectionStart;
    switch (keyCode) {
      case 'ShiftLeft':
        if (this.state.isCapsLockPressed) {
        // make all letter caseDown
          this.state.isShiftLeftPressed = true;
          this.toggleKeysCase();
          this.btnDown();
        } else {
          this.state.isShiftLeftPressed = true;
          this.toggleKeysCase();
          this.btnDown();
        }
        break;
      case 'ShiftRight':
        if (this.state.isCapsLockPressed) {
        // make all letter caseDown
          this.state.isShiftRightPressed = true;
          this.toggleKeysCase();
          this.btnDown();
        } else {
          this.state.isShiftRightPressed = true;
          this.toggleKeysCase();
          this.btnDown();
        }
        break;
      case 'Backspace':
        if (keysObject.FN_BTN.includes(keyCode)) {
          let removedText = '';
          if (selectionStartIndex > 0 && selectionStartIndex <= textareaValue.length) {
            removedText = textareaValue.slice(0, selectionStartIndex - 1)
                    + (textareaValue.slice(selectionStartIndex, textareaValue.length));
            this.textarea.value = removedText;
            this.textarea.focus();
            this.textarea.selectionStart = selectionStartIndex - 1;
            this.textarea.selectionEnd = selectionStartIndex - 1;
          }
          this.btnDown();
        }
        break;
      case 'Delete':
        if (keysObject.FN_BTN.includes(keyCode)) {
          let deleteText = '';
          if (selectionStartIndex >= 0 && selectionStartIndex <= textareaValue.length - 1) {
            deleteText = textareaValue.slice(0, selectionStartIndex)
            + (textareaValue.slice(selectionStartIndex + 1, textareaValue.length));
            this.textarea.value = deleteText;
            this.textarea.focus();
            this.textarea.selectionStart = selectionStartIndex;
            this.textarea.selectionEnd = selectionStartIndex;
          }
          this.btnDown();
        }
        break;
      case 'Del': {
        let deleteText = '';
        if (selectionStartIndex >= 0 && selectionStartIndex <= textareaValue.length - 1) {
          deleteText = textareaValue.slice(0, selectionStartIndex)
              + (textareaValue.slice(selectionStartIndex + 1, textareaValue.length));
          this.textarea.value = deleteText;
          this.textarea.focus();
          this.textarea.selectionStart = selectionStartIndex;
          this.textarea.selectionEnd = selectionStartIndex;
        }
        this.btnDown();
      }
        break;
      case 'Tab':
        if (keysObject.FN_BTN.includes(keyCode)) {
          this.current.char = '    ';
          this.btnDown();
        }
        break;
      case 'Enter':
        if (keysObject.FN_BTN.includes(keyCode)) {
          this.current.char = '\n';
          this.btnDown();
        }
        break;
      case 'AltRight':
        if (keysObject.FN_BTN.includes(keyCode)) {
          this.btnDown();
        }
        break;
      case 'AltLeft':
        if (keysObject.FN_BTN.includes(keyCode)) {
          this.btnDown();
        }
        break;
      case 'ControlRight':
        if (keysObject.FN_BTN.includes(keyCode)) {
          this.btnDown();
        }
        break;
      case 'ControlLeft':
        if (keysObject.FN_BTN.includes(keyCode)) {
          this.btnDown();
        }
        break;
      case 'MetaLeft':
        if (keysObject.FN_BTN.includes(keyCode)) {
          this.btnDown();
        }
        break;
      case 'ArrowUp':
        if (!keysObject.FN_BTN.includes(keyCode)) {
          this.btnDown();
        }
        break;
      case 'ArrowDown':
        if (!keysObject.FN_BTN.includes(keyCode)) {
          this.btnDown();
        }
        break;
      case 'ArrowLeft':
        if (!keysObject.FN_BTN.includes(keyCode)) {
          this.btnDown();
        }
        break;
        // no default
    }
  }

  keyDownHandler(e) {
    e.preventDefault();
    this.current.event = e;
    this.current.code = e.code;

    const textareaValue = this.textarea.value;
    const selectionStartIndex = this.textarea.selectionStart;
    [this.current.element] = this.element.getElementsByClassName(e.code);
    if (this.current.element) {
      this.current.char = this.current.element.querySelectorAll(':not(.hidden)')[1].textContent;
      this.turnOnHighLightPressedButton();
    }
    switch (e.code) {
      case 'ShiftLeft':
        if (this.state.isCapsLockPressed) {
        // make all letter caseDown
          this.state.isShiftLeftPressed = true;
          this.toggleKeysCase();
          this.btnDown();
        } else {
          this.state.isShiftLeftPressed = true;
          this.toggleKeysCase();
          this.btnDown();
        }
        break;
      case 'ShiftRight':
        if (this.state.isCapsLockPressed) {
        // make all letter caseDown
          this.state.isShiftRightPressed = true;
          this.toggleKeysCase();
          this.btnDown();
        } else {
          this.state.isShiftRightPressed = true;
          this.toggleKeysCase();
          this.btnDown();
        }
        break;
      case 'Backspace':
        if (keysObject.FN_BTN.includes(e.code)) {
          let removedText = '';
          if (selectionStartIndex > 0 && selectionStartIndex <= textareaValue.length) {
            removedText = textareaValue.slice(0, selectionStartIndex - 1)
                    + (textareaValue.slice(selectionStartIndex, textareaValue.length));
            this.textarea.value = removedText;
            this.textarea.selectionStart = selectionStartIndex - 1;
            this.textarea.selectionEnd = selectionStartIndex - 1;
          }
          this.btnDown();
        }
        break;
      case 'Delete':
        if (keysObject.FN_BTN.includes(e.code)) {
          let deleteText = '';
          if (selectionStartIndex >= 0 && selectionStartIndex <= textareaValue.length - 1) {
            deleteText = textareaValue.slice(0, selectionStartIndex)
            + (textareaValue.slice(selectionStartIndex + 1, textareaValue.length));
            this.textarea.value = deleteText;
            this.textarea.selectionStart = selectionStartIndex;
            this.textarea.selectionEnd = selectionStartIndex;
          }
          this.btnDown();
        }
        break;
      case 'Tab':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.current.char = '    ';
          this.inputText(e.key);
          this.btnDown();
        }
        break;
      case 'Enter':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.current.char = '\n';
          this.inputText(e.key);
          this.btnDown();
        }
        break;
      case 'AltRight':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnDown();
        }
        break;
      case 'AltLeft':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnDown();
        }
        break;
      case 'ControlRight':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnDown();
        }
        break;
      case 'ControlLeft':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnDown();
        }
        break;
      case 'MetaLeft':
        if (keysObject.FN_BTN.includes(e.code)) {
          this.btnDown();
        }
        break;
      case 'ArrowUp':
        if (!keysObject.FN_BTN.includes(e.code)) {
          this.btnDown();
        }
        break;
      case 'ArrowDown':
        if (!keysObject.FN_BTN.includes(e.code)) {
          this.btnDown();
        }
        break;
      case 'ArrowLeft':
        if (!keysObject.FN_BTN.includes(e.code)) {
          this.btnDown();
        }
        break;
      case 'ArrowRight':
        if (!keysObject.FN_BTN.includes(e.code)) {
          this.btnDown();
        }
        break;
        // no default
    }
    if (!keysObject.FN_BTN.includes(e.code)) {
      this.inputText(e.key);
    }
  }

  toggleCapsLock(e) {
    const keyCode = e.code || e;
    if (keyCode === 'CapsLock') {
      if (!this.state.isCapsLockPressed) {
        this.addActiveState();
        this.state.isCapsLockPressed = true;
        this.toggleKeysCase();
      } else {
        this.removeActiveState();
        this.state.isCapsLockPressed = false;
        this.toggleKeysCase();
      }
    }
  }

  addActiveState() {
    this.current.element.classList.add('active');
  }

  turnOnHighLightPressedButton() {
    this.current.element.classList.add('pressed');
  }

  turnOffHighLightPressedButton() {
    this.current.element.classList.remove('pressed');
  }

  btnDown() {
    this.current.element.classList.add('pressed');
  }

  btnUp() {
    this.current.element.classList.remove('pressed');
  }

  removeActiveState() {
    this.current.element.classList.remove('active');
  }

  toggleLang() {
    const e = this.element.querySelectorAll(`div>.${this.state.lang}`);
    for (let s = 0; s < e.length; s += 1) {
      e[s].classList.toggle('hidden');
      e[s].querySelectorAll(`span.${this.state.case}`)[0].classList.toggle('hidden');
    }
  }

  languageSwitch(evt) {
    this.toggleLang();
    if (evt.ctrlKey && evt.altKey) {
      if (localStorage.getItem('lang') === 'eng') {
        localStorage.setItem('lang', 'rus');
      } else {
        localStorage.setItem('lang', 'eng');
      }
      this.state.lang = localStorage.getItem('lang');
    }
    this.toggleLang();
  }

  initLang() {
    if (localStorage.lang === undefined) {
      localStorage.setItem('lang', this.state.lang);
    }
    this.toggleLang();
    this.state.lang = localStorage.getItem('lang');
    this.toggleLang();
  }

  toggleKeysCase() {
    const e = this.element.querySelectorAll(`div>.${this.state.lang}`);
    for (let s = 0; s < e.length; s += 1) {
      if (this.state.isCapsLockPressed && (this.state.isShiftLeftPressed === false
        || this.state.isShiftRightPressed === false)) {
        e[s].querySelectorAll('span')[0].classList.add('hidden');
        e[s].querySelectorAll('span')[3].classList.add('hidden');
        e[s].querySelectorAll('span')[2].classList.remove('hidden');
        this.state.case = 'caps';
      } else {
        e[s].querySelectorAll('span')[1].classList.add('hidden');
        e[s].querySelectorAll('span')[2].classList.add('hidden');
        e[s].querySelectorAll('span')[0].classList.remove('hidden');
        this.state.case = 'caseDown';
      }
      if ((this.state.isShiftLeftPressed || this.state.isShiftRightPressed)) {
        if (this.state.isCapsLockPressed) {
          e[s].querySelectorAll('span')[0].classList.add('hidden');
          e[s].querySelectorAll('span')[1].classList.add('hidden');
          e[s].querySelectorAll('span')[2].classList.add('hidden');
          e[s].querySelectorAll('span')[3].classList.remove('hidden');
          this.state.case = 'shiftCaps';
        } else {
          e[s].querySelectorAll('span')[1].classList.remove('hidden');
          e[s].querySelectorAll('span')[2].classList.add('hidden');
          e[s].querySelectorAll('span')[3].classList.add('hidden');
          e[s].querySelectorAll('span')[0].classList.add('hidden');
          this.state.case = 'caseUp';
        }
      }
    }
  }
}

export default KeyboardJs;
