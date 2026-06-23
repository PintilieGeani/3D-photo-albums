export const createPages = (pictures) => {
    const pages = [
      {
        front: "book-cover",
        back: pictures[0],
      },
    ];

    for (let i = 1; i < pictures.length - 1; i += 2) {
      pages.push({
        front: pictures[i % pictures.length],
        back: pictures[(i + 1) % pictures.length],
      });
    }
    
    pages.push({
      front: pictures[pictures.length - 1],
      back: "book-back",
    });

    return pages
    
} 

