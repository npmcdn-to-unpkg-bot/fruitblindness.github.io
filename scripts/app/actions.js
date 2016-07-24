// Actions
export const actions = {
  toggleNext: function() {
    var current = state.currentSlide;
    var next = current + 1;
    if (next > state.data.length - 1) {
      next = 0;
    }
    state.currentSlide = next;
    render(state)
  },
  togglePrev: function() {
    var current = state.currentSlide;
    var prev = current - 1;
    if (prev < 0) {
      prev = state.data.length - 1;
    }
    state.currentSlide = prev;
		render(state);
  },
  toggleSlide: function(id) {
    var index = state.data.map(function (el) {
      return (
        el.id
      );
    });
    var currentIndex = index.indexOf(id);
    state.currentSlide = currentIndex;
		// if project not open, open selected project index, set state to open and re-render
		if (state.projectOpen == false) {
			state.projectOpen = true;
		}
    render(state);
	},
	closeProjects: function() {
		state.projectOpen = false;
		render(state);
	}
}
