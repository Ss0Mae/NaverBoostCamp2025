function find(param0, param1) {
  const books = [
    {
      name: "Great",
      discontinued: true,
      category: "Novel",
      rating: 3.1,
      count: 2,
      start: "197001",
      end: "198104",
    },
    {
      name: "Laws",
      discontinued: true,
      category: "Novel",
      rating: 4.8,
      count: 3,
      start: "198006",
      end: "198507",
    },
    {
      name: "Dracula",
      discontinued: true,
      category: "Drama",
      rating: 2.3,
      count: 6,
      start: "199105",
      end: "199605",
    },
    {
      name: "Mario",
      discontinued: true,
      category: "Drama",
      rating: 3.8,
      count: 4,
      start: "200109",
      end: "201211",
    },
    {
      name: "House",
      discontinued: false,
      category: "Magazine",
      rating: 4.4,
      count: 1,
      start: "198707",
      end: "999912",
    },
    {
      name: "Art1",
      discontinued: true,
      category: "Design",
      rating: 4.2,
      count: 2,
      start: "198506",
      end: "199107",
    },
    {
      name: "Art2",
      discontinued: true,
      category: "Design",
      rating: 3.0,
      count: 3,
      start: "199502",
      end: "200512",
    },
    {
      name: "Wars",
      discontinued: true,
      category: "Novel",
      rating: 4.6,
      count: 2,
      start: "198204",
      end: "200305",
    },
    {
      name: "Solo",
      discontinued: false,
      category: "Poem",
      rating: 4.9,
      count: 2,
      start: "200703",
      end: "999912",
    },
    {
      name: "Lost",
      discontinued: false,
      category: "Web",
      rating: 3.2,
      count: 8,
      start: "199806",
      end: "999912",
    },
    {
      name: "Ocean",
      discontinued: true,
      category: "Magazine",
      rating: 4.3,
      count: 1,
      start: "200502",
      end: "202006",
    },
  ];

  const result = books
    .filter((b) => b.start <= param0 && param0 <= b.end)
    .filter((b) => b.count >= param1)
    .map((b) => ({
      text: `${b.name}${b.discontinued ? "*" : ""}(${b.category}) ${b.rating}`,
      rating: b.rating,
    }))
    .sort((a, b) => b.rating - a.rating)
    .map((x) => x.text)
    .join(", ");

  return result || "!EMPTY";
}
