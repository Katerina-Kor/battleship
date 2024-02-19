export const parseMessage = (message: string) => {
  const resMessage = JSON.parse(message);

  if (resMessage.data !== '') {
    resMessage.data = JSON.parse(resMessage.data);
  }

  return resMessage;
};

export const getRandomTurn = () => {
  return Math.random() > 0.5 ? 1 : 0;
}