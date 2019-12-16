/**
 * Scenarios:
 * (1) Unaffected: Bruce Wayne |foobar|
 * (2) Remove tag: foo|bar Bruce Wayne bar|foo
 * (3) Update offset & length only: |foobar| Bruce Wayne
 * (4) Update text, offset & length (right): foobar Bruce| Wayne|
 * (5) Update text, offset & length (left): |foobar Bruce| Wayne
 */
const fixSelection = selection => {
  if (selection.start <= selection.end) {
    return selection;
  }

  return {
    start: selection.end,
    end: selection.start,
  };
};

export const updateTags = (tags, selections, inputText) => {
  const [before, current] = selections.map(fixSelection);

  return tags.reduce((done, tag) => {
    const tagStart = tag.offset;
    const tagEnd = tag.offset + tag.length;

    // (1)
    if (tagEnd < current.start) {
      return done.concat(tag);
    }

    // (2)
    if (tagStart >= before.start && tagEnd <= before.end) {
      return done;
    }

    // (3)
    if (tagStart > before.end) {
      return done.concat({
        ...tag,
        offset: tagStart - (before.end - before.start),
      });
    }

    // (4)
    if (tagStart < before.start && tagEnd >= before.start) {
      const oldName = tag.name;
      const whitespaces = [...oldName.matchAll(/ /g)];
      const newWord = whitespaces.reduce(
        (previousValue, currentValue, currentIndex, array) => {
          if (currentValue.index < before.start) {
            if (currentIndex === 0) {
              return previousValue.concat(
                currentValue.input.substring(0, currentValue.index),
              );
            }
            
          }
        },
        '',
      );
      // const untouchedWhitespaces = whitespaces.filter(
      //   ({index}) => index < before.start || index > before.end,
      // );
      //
      // const newName = untouchedWhitespaces.map(found => found.input.substring())
      // let newName = oldName.substring(
      //   0,
      //   oldName.length - (tagEnd - before.start),
      // );
      //
      // let newOffset = tag.offset;
      //
      // if (newName.startsWith(' ')) {
      //   newName = newName.trim();
      //   newOffset -= 1;
      // }
      //
      // if (oldName.includes(newName)) {
      //   return done.concat({
      //     ...tag,
      //     offset: newOffset,
      //     name: newName,
      //     length: newName.length,
      //   });
      // }

      return done;
    }

    // (5)
    if (
      tagStart >= before.start &&
      tagStart <= before.end &&
      tagEnd > before.end
    ) {
      return done;
    }

    return done.concat(tag);
  }, []);
};
