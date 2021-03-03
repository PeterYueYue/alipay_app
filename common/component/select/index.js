Component({
  data: {
    isConfirm: false, // 确认是否可点击
    selectList: [
      {
        title: '请选择',
        sub: []
      }
    ], // list数据
    activeTab: 0 // 当前tab项
  },
  props: {
    selectShow: false // 选择面板是否展示
  },
  didMount() {
    const { list } = this.props;
    this.setData({
      selectList: [
        {
          title: '请选择',
          sub: list
        }
      ]
    });
  },
  didUpdate(prevProps, prevData) {
    const { selectValue, list } = this.props;
    // 面板状态改变的时候数据的重新渲染
    if (!prevProps.selectShow && this.props.selectShow && selectValue) {
      const selectArray = selectValue.split(' ');
      let selectList = [];
      selectArray.map((item, k) => {
        if (k === 0) {
          const provinces = {
            title: item,
            sub: list
          };
          selectList.push(provinces);
        }
        if (k === 1) {
          list.map((data, index) => {
            if (data.name === selectArray[k - 1]) {
              const city = {
                title: item,
                sub: data.sub
              };
              selectList.push(city);
            }
          });
        }
        if (k === 2) {
          list.map((data, index) => {
            if (data.name === selectArray[k - 2]) {
              data.sub.map((areaData, i) => {
                if (areaData.name === selectArray[k - 1]) {
                  const area = {
                    title: item,
                    sub: areaData.sub
                  };
                  selectList.push(area);
                }
              });
            }
          });
        }
      });
      this.setData({
        selectList,
        activeTab: selectArray.length - 1
      });
    }
  },
  didUnmount() { },
  methods: {
    /**
   * 关闭popup
   * @method onPopupClose
   */
    onPopupClose() {
      const { selectValue, list } = this.props;
      if (!selectValue) {
        this.setData({
          isConfirm: false,
          selectList: [
            {
              title: '请选择',
              sub: list
            }
          ],
          activeTab: 0
        });
      }
      this.props.onClose();
    },
    /**
     * 确认
     * @method onConfirm
     * @param {*} e
     */
    onConfirm(e) {
      if (e.target.dataset.click) {
        // 点击确定
        const { selectList } = this.data;
        let result = [];
        selectList.map((item) => {
          const singleSelect = {
            name: item.title,
            code: item.code
          };
          result.push(singleSelect);
        });
        this.props.onSelectSuccess(result);
        this.props.onClose();
      }
    },
    /**
     * 取消
     * @method onCancel
     */
    onCancel() {
      this.props.onClose();
    },
    /**
     * tab切换
     * @method handleTabClick
     * @param {*} index
     */
    handleTabClick({ index }) {
      this.setData({
        activeTab: index
      });
    },
    /**
     * 省市区选择事件
     * @method itemSelect
     * @param {*} e
     */
    itemSelect(e) {
      const { key, name, code, sub } = e.target.dataset;
      const { list } = this.props;
      if (key === 0) { // 第一级数据处理
        if (sub) {
          this.setData({
            selectList: [
              {
                title: name,
                code,
                sub: list
              },
              {
                title: '城市',
                sub: sub
              }
            ],
            activeTab: 1,
            isConfirm: false
          });
        } else {
          this.setData({
            selectList: [
              {
                title: name,
                code,
                sub: list
              }
            ],
            isConfirm: true
          });
        }
      }
      if (key === 1) { // 第二级数据处理
        if (sub) {
          this.setData({
            selectList: [
              {
                title: this.data.selectList[0].title,
                code: this.data.selectList[0].code,
                sub: list
              },
              {
                title: name,
                code,
                sub: this.data.selectList[1].sub
              },
              {
                title: '区县',
                sub: sub
              }
            ],
            activeTab: 2,
            isConfirm: false
          });
        } else {
          this.setData({
            selectList: [
              {
                title: this.data.selectList[0].title,
                code: this.data.selectList[0].code,
                sub: list
              },
              {
                title: name,
                code,
                sub: this.data.selectList[1].sub
              }
            ],
            activeTab: 1,
            isConfirm: true
          });
        }
      }
      if (key === 2) { // 第三级数据处理
        this.setData({
          selectList: [
            {
              title: this.data.selectList[0].title,
              code: this.data.selectList[0].code,
              sub: list
            },
            {
              title: this.data.selectList[1].title,
              code: this.data.selectList[1].code,
              sub: this.data.selectList[1].sub
            },
            {
              title: name,
              code,
              sub: this.data.selectList[2].sub
            }
          ],
          activeTab: 2,
          isConfirm: true
        });
      }
    }
  }
});
