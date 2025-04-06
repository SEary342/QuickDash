import store, {
    setSelectedDash,
    setNumberOfColumns,
    addLinkPage,
    overwriteConfig,
  } from "./store";
  
  // Mock localStorage directly before the store is initialized
  beforeAll(() => {
    // Mock localStorage to return custom state
    global.localStorage = {
      getItem: vi.fn().mockReturnValue(
        JSON.stringify({
          selectedDash: "",
          quickDashConfig: [],
          numberOfColumns: 3,
        })
      ),
      setItem: vi.fn(),
      clear: vi.fn(),
      length: 0, // Mock length
      key: vi.fn().mockReturnValue(null),
      removeItem: vi.fn(),
    } as unknown as Storage;
  });
  
  describe('Redux Store', () => {
    it('should load initial state correctly', () => {
      const state = store.getState();
      expect(state.app.selectedDash).toBe("");
      expect(state.app.numberOfColumns).toBe(3);
      expect(state.linkPages).toEqual([]);
    });
  
    it('should update the selectedDash when setSelectedDash is dispatched', () => {
      store.dispatch(setSelectedDash("newDash"));
      const state = store.getState();
      expect(state.app.selectedDash).toBe("newDash");
    });
  
    it('should update the numberOfColumns when setNumberOfColumns is dispatched', () => {
      store.dispatch(setNumberOfColumns(4));
      const state = store.getState();
      expect(state.app.numberOfColumns).toBe(4);
    });
  
    it('should add a new link page when addLinkPage is dispatched', () => {
      const newLinkPage = { id: 1, name: 'New Page', groupList: [] }; // Replace with actual structure
      store.dispatch(addLinkPage(newLinkPage));
      const state = store.getState();
      expect(state.linkPages).toHaveLength(1);
      expect(state.linkPages[0]).toEqual(newLinkPage);
    });
  
    it('should overwrite the linkPages when overwriteConfig is dispatched', () => {
      const newLinkPages = [
        { id: 1, name: 'Page 1', groupList: [] },
        { id: 2, name: 'Page 2', groupList: [] }
      ];
      store.dispatch(overwriteConfig(newLinkPages));
      const state = store.getState();
      expect(state.linkPages).toEqual(newLinkPages);
    });
  
    it('should update localStorage when state changes', () => {
      store.dispatch(setSelectedDash("newDash"));
      store.dispatch(setNumberOfColumns(4));
  
      // Simulate state update and check if localStorage is updated
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "app",
        JSON.stringify({
          selectedDash: "newDash",
          quickDashConfig: [],
          numberOfColumns: 4,
        })
      );
    });
  });
  