export const theme = {
  cellHeight: 30,
  colors: {
    primary: '#3f51b5',
    rgba: {
      primary: opacity => `rgba(63, 81, 181, ${opacity / 100})`,
    },
    event: {
      meeting: {
        background: '#82aef1',
        text: '#10356b',
        handle: '#096dff',
      },
      lunch: {
        background: '#fff5e0',
        text: '#503a0d',
        handle: '#ffba29',
      },
    },
  },
  transition: '0.1s ease-in-out',
};
