describe("Test TUPhom", function() {

	var hand = new gbjs.HandContainer(), 
		cards;


	/**
	 * Utils
	 * @param {Array} cards
	 */
	function addCards(cards) {
		hand.removeAllChildren();
		for(var i in cards) {
			hand.addChild(new gbjs.BitmapCard('card/3b.png', cards[i]));
		}
	}
	function map(card) {
		return card.getValue();
	}


	it("Không có quân bài chặt 2", function() {
		addCards([0, 1, 2]);
		var cards = gbjs.TUPhom([48], hand.getChildAt(0)).getCards();
    expect(cards.map(map)).toEqual([]);
  });

	it("Chat doi 3 4-5", function() {
		addCards([4, 5, 6]);
		var cards = gbjs.TUPhom([0, 1], hand.getChildAt(0)).getCards();
    expect(cards.map(map)).toEqual([4, 5]);
  });

  it("Chat doi 3 5-6", function() {
		addCards([4, 5, 6]);
		var cards = gbjs.TUPhom([0, 1], hand.getChildAt(1)).getCards();
    expect(cards.map(map)).toEqual([5, 6]);
  });

  it("Chặt 2 bằng tứ quý", function() {
		addCards([0, 1, 2, 3]);
		var cards = gbjs.TUPhom([48], hand.getChildAt(0)).getCards();
    expect(cards.map(map)).toEqual([0, 1, 2, 3]);
  });

  it('Chặt 2 bằng 3 đôi thông', function() {
		addCards([0, 1, 4, 5, 8, 9]);
		var cards = gbjs.TUPhom([48], hand.getChildAt(0)).getCards();
    expect(cards.map(map)).toEqual([0, 1, 4, 5, 8, 9]);
  })


  it('Chặt 2 bằng 4 đôi thông', function() {
		addCards([0, 1, 4, 5, 8, 9, 12, 13]);
		var cards = gbjs.TUPhom([48], hand.getChildAt(0)).getCards();
    expect(cards.map(map)).toEqual([0, 1, 4, 5, 8, 9, 12, 13]);
  })

  it('Chặt tứ quý', function() {
		addCards([4, 5, 6, 7]);
		var cards = gbjs.TUPhom([0, 1, 2, 3], hand.getChildAt(0)).getCards();
    expect(cards.map(map)).toEqual([4, 5, 6, 7]);
  })


  it('Chặt 3 đôi thông', function() {
		addCards([4, 5, 8, 9, 12, 13]);
		var cards = gbjs.TUPhom([0, 1, 4, 5, 8, 9], hand.getChildAt(0)).getCards();
    expect(cards.map(map)).toEqual([4, 5, 8, 9, 12, 13]);
  })


  it('Chặt bốn đôi thông', function() {
		addCards([4, 5, 8, 9, 12, 13, 16, 17]);
		var cards = gbjs.TUPhom([0, 1, 4, 5, 8, 9, 12, 13], hand.getChildAt(0)).getCards();
    expect(cards.map(map)).toEqual([4, 5, 8, 9, 12, 13, 16, 17]);
  });

  it('Chặt tứ quý bằng 3 đôi thông', function() {
  	addCards([4,5, 8,9, 12, 13]);
		var cards = gbjs.TUPhom([0, 1, 2, 3], hand.getChildAt(0)).getCards();
		expect(cards.map(map)).toEqual([4,5, 8,9, 12, 13]);
  });

  it('Chặt tứ quý bằng tứ quý to hơn', function() {
  	addCards([4, 5, 6, 7]);
		var cards = gbjs.TUPhom([0, 1, 2, 3], hand.getChildAt(0)).getCards();
		expect(cards.map(map)).toEqual([4, 5, 6, 7]);
  })

  it('Chặt đôi 2 bằng tứ quý', function() {
  	addCards([4, 5, 6, 7]);
		var cards = gbjs.TUPhom([48, 49], hand.getChildAt(0)).getCards();
		expect(cards.map(map)).toEqual([4, 5, 6, 7]);
  });


  it('Chặt đôi 2 bằng 4 đôi thông', function() {
  	addCards([0, 1, 4, 5, 8, 9, 12, 13]);
		var cards = gbjs.TUPhom([48, 49], hand.getChildAt(0)).getCards();
		expect(cards.map(map)).toEqual([0, 1, 4, 5, 8, 9, 12, 13]);
  });


  it('Chặt dọc khong thanh cong', function() {
  	addCards([1, 6, 9, 12]);
		var cards = gbjs.TUPhom([0, 4, 8, 13], hand.getChildAt(0)).getCards();
		expect(cards.length).toEqual(0);
  });

  it('Chặt dọc', function() {
  	addCards([4, 8, 12, 16]);
		var cards = gbjs.TUPhom([0, 4, 8, 12], hand.getChildAt(0)).getCards();
		expect(cards.map(map)).toEqual([4, 8, 12, 16]);
  });
});