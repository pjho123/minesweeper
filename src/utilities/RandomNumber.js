export const RandomNumber = {
    byCount: (count, maxLength) => {
        const randomNumbers = [];

        while (randomNumbers.length < count) {
            const newNumber = Math.floor(Math.random() * maxLength);

            if (!randomNumbers.includes(newNumber)) {
                randomNumbers.push(newNumber);
            }
        }

        return randomNumbers;
    }
};
