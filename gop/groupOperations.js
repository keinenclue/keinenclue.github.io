class GroupOperations {
  constructir() {
    if (new.target === GroupOperations) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  calculateOrder(number, modulo) {
    throw new Error("Not implemented!");
  }

  calculateCreators(modulo) {
    throw new Error("Not implemented!");
  }

  phi(n) {
    // init
    var result = 1;

    // walk through all integers up to n
    for (let i = 2; i < n; i++) {
      if (this.#gcd(i, n) === 1) {
        result++;
      }
    }
    return result;
  }

  // return Greater Common Denominator of two given numbers
  #gcd(a, b) {
    if (a === 0) {
      return b;
    }
    return this.#gcd(b % a, a);
  }
}

class MulGroup extends GroupOperations {
  calculateOrder(number, modulo) {
    number = parseInt(number);
    modulo = parseInt(modulo);
    let counter = 1;
    const originalNumber = number;
    while (number != 1) {
      number = (originalNumber * number) % modulo;
      counter++;

      if (counter >= 100000)
        throw new Error("Overflow, probaply invalid input!");
    }
    return counter;
  }

  calculateCreators(modulo) {
    modulo = parseInt(modulo);
    const creators = [];
    let phin = this.phi(modulo);
    for (let i = 1; i < modulo; i++) {
      if (this.calculateOrder(i, modulo) === phin) {
        creators.push(i);
      }
    }
    return creators;
  }
}

class AddGroup extends GroupOperations {
  calculateOrder(number, modulo) {
    number = parseInt(number);
    modulo = parseInt(modulo);
    let counter = 1;
    let helpNumber = number;
    while (helpNumber != 0) {
      helpNumber = (helpNumber + number) % modulo;
      counter++;

      if (counter >= 100000)
        throw new Error("Overflow, probaply invalid input!");
    }
    return counter;
  }

  calculateCreators(modulo) {
    modulo = parseInt(modulo);
    const creators = [];
    for (let i = 0; i < modulo; i++) {
      if (this.calculateOrder(i, modulo) === modulo - 1) {
        creators.push(i);
      }
    }
    return creators;
  }
}
