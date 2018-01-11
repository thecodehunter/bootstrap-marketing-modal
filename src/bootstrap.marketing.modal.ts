enum DisplayMode {
    UNIQUE = 'unique',
    ALWAYS = 'always',
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

interface MarketingModalOptions {
    modalId: string;
    onPageLoad: boolean;
    displayMode: DisplayMode;
}

class DateTimeFactory {
    static create(datetime?) {
        return datetime ? new Date(Number(datetime)).setHours(0,0,0,0) : new Date().setHours(0,0,0,0);
    }
}

class ScheduleDateTimeFactory {
    static create(displayMode?: DisplayMode): Date {
        const today = new Date();
        let scheduleDateTime = null;
        
        if (displayMode === DisplayMode.DAILY) {
            scheduleDateTime = today.setDate(today.getDate() + 1);
        }
        if (displayMode === DisplayMode.WEEKLY) {
            scheduleDateTime = today.setDate(today.getDate() + 7);
        }
        if (displayMode === DisplayMode.MONTHLY) {
            scheduleDateTime = today.setMonth(today.getMonth() + 1);
        }

        return scheduleDateTime;
    }
}

class MarketingModal {

    private modalDomRef: HTMLDivElement;
    private internalId: string;

    constructor(private modalId: string, private options: MarketingModalOptions) {
        this.modalDomRef = <HTMLDivElement>document.getElementById(modalId);
        this.internalId = `__$m_${modalId}`;
        this.init();
    }

    private init(): void {
        this.registerEventListeners();
        this.executeActions();
    }

    private uniqueDisplayModeHandler(): void {
        const unique = Number(localStorage.getItem(this.internalId)) === 0;
        if (!unique) {
            localStorage.setItem(this.internalId, '0');
            this.open();
        }
    }

    private scheduleDisplayModeHandler(): void {

        const currentScheduleDateTime = localStorage.getItem(this.internalId);
        // first time schedule or previously set to unique 
        if (!currentScheduleDateTime || currentScheduleDateTime === '0') {
            this.saveScheduleDateTime();
            return;
        }

        const currentScheduleDate = DateTimeFactory.create(currentScheduleDateTime);

        if (currentScheduleDate && currentScheduleDate === DateTimeFactory.create()) {
            this.open();
            this.saveScheduleDateTime();
        }
    }

    private saveScheduleDateTime(): void {
        const newScheduleDateTime = ScheduleDateTimeFactory.create(this.options.displayMode);

        if (newScheduleDateTime) {
            localStorage.setItem(this.internalId, newScheduleDateTime.toString());
        }
    }

    private executeActions(): void {
        if (this.options.onPageLoad) {
            if (this.options.displayMode === DisplayMode.UNIQUE) {
                this.uniqueDisplayModeHandler();
            } else if (this.options.displayMode === DisplayMode.ALWAYS) {
                this.open();
            } else {
                this.scheduleDisplayModeHandler();
            }
        }
    }

    private registerEventListeners(): void {
        document.querySelector(`#${this.options.modalId} [data-dismiss="modal"]`).addEventListener("click", () => {
            this.close();
        });
    }

    public open(): void {
        this.modalDomRef.style.display = 'block';
    }
    public close(): void {
        this.modalDomRef.style.display = 'none';
    }

}