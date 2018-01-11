var DisplayMode;
(function (DisplayMode) {
    DisplayMode["UNIQUE"] = "unique";
    DisplayMode["ALWAYS"] = "always";
    DisplayMode["DAILY"] = "daily";
    DisplayMode["WEEKLY"] = "weekly";
    DisplayMode["MONTHLY"] = "monthly";
})(DisplayMode || (DisplayMode = {}));
var DateFactory = /** @class */ (function () {
    function DateFactory() {
    }
    DateFactory.create = function (datetime) {
        return datetime ? new Date(Number(datetime)).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0);
    };
    return DateFactory;
}());
var ScheduleDateTimeFactory = /** @class */ (function () {
    function ScheduleDateTimeFactory() {
    }
    ScheduleDateTimeFactory.create = function (displayMode) {
        var today = new Date();
        var scheduleDateTime = null;
        if (displayMode === DisplayMode.DAILY) {
            scheduleDateTime = today.setDate(today.getDate() + 1);
        }
        /*
        if (this.options.displayMode === DisplayMode.WEEKLY) {
            scheduleDateTime = today.setDate(today.getDate() + 1);
        }*/
        if (displayMode === DisplayMode.MONTHLY) {
            scheduleDateTime = today.setMonth(today.getMonth() + 1);
        }
        return scheduleDateTime;
    };
    return ScheduleDateTimeFactory;
}());
var MarketingModal = /** @class */ (function () {
    function MarketingModal(options) {
        this.options = options;
        this.modalDomRef = document.getElementById(options.modalId);
        this.internalId = "__$m_" + this.options.modalId;
        this.init();
    }
    MarketingModal.prototype.init = function () {
        this.registerEventListeners();
        this.executeActions();
    };
    MarketingModal.prototype.uniqueDisplayModeHandler = function () {
        var unique = Number(localStorage.getItem(this.internalId)) === 0;
        if (!unique) {
            localStorage.setItem(this.internalId, '0');
            this.open();
        }
    };
    MarketingModal.prototype.scheduleDisplayModeHandler = function () {
        var currentScheduleDateTime = localStorage.getItem(this.internalId);
        // first time schedule or previously set to unique 
        if (!currentScheduleDateTime || currentScheduleDateTime === '0') {
            this.saveScheduleDateTime();
            return;
        }
        var currentScheduleDate = DateFactory.create(currentScheduleDateTime);
        if (currentScheduleDate && currentScheduleDate === DateFactory.create()) {
            this.open();
            this.saveScheduleDateTime();
        }
    };
    MarketingModal.prototype.saveScheduleDateTime = function () {
        var newScheduleDateTime = ScheduleDateTimeFactory.create(this.options.displayMode);
        if (newScheduleDateTime) {
            localStorage.setItem(this.internalId, newScheduleDateTime.toString());
        }
    };
    MarketingModal.prototype.executeActions = function () {
        if (this.options.onPageLoad) {
            if (this.options.displayMode === DisplayMode.UNIQUE) {
                this.uniqueDisplayModeHandler();
            }
            else if (this.options.displayMode === DisplayMode.ALWAYS) {
                this.open();
            }
            else {
                this.scheduleDisplayModeHandler();
            }
        }
    };
    MarketingModal.prototype.registerEventListeners = function () {
        var _this = this;
        document.querySelector("#" + this.options.modalId + " [data-dismiss=\"modal\"]").addEventListener("click", function () {
            _this.close();
        });
    };
    MarketingModal.prototype.open = function () {
        this.modalDomRef.style.display = 'block';
    };
    MarketingModal.prototype.close = function () {
        this.modalDomRef.style.display = 'none';
    };
    return MarketingModal;
}());
