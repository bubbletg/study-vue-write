// const arr = [1, 2, 3, 4, 5, 6, 7, 8, 0];
// const arr = [1, 8, 5, 3, 4, 9, 7, 6, 0];
const arr = [2, 3, 1, 5, 6, 8, 7, 9, 4];

console.log(getSequence(arr));
function getSequence(arr) {
  const len = arr.length;
  const result = [0]; //索引
  const p = arr.slice(0); // 拷贝一份
  let start;
  let end;
  let middle;

  for (let i = 0; i < len; i++) {
    const item = arr[i];
    if (item != 0) {
      let resultLastIndex = result[result.length - 1];

      // 取到索引对应的值
      if (arr[resultLastIndex] < item) {
        // 标记当前前一个值的索引
        p[i] = result[resultLastIndex];
        result.push(i);
        // 当前的值比上一个大，直接push,并且记住这个值得前一个
        continue;
      }

      // 二分查找，找到比当前值大的
      start = 0;
      end = result.length - 1;
      while (start < end) {
        middle = ((start + end) / 2) | 0;
        if (arr[result[middle]] < item) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      if (item < arr[result[start]]) {
        if (start > 0) {
          p[i] = result[start - 1];
        }
        result[start] = i;
      }
    }
  }
  let len1 = result.length;
  let last = result[len1 - 1];
  while (len1-- > 0) {
    result[len1] = last;
    last = p[last];
  }
  return result;
}
