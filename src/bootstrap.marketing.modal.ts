enum DisplayMode {
    UNIQUE = 'unique',
    ALWAYS = 'always',
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

enum ModalAction {
    CLOSE = 'none',
    OPEN = 'block'
}

interface MarketingModalOptions {
    modalId: string;
    onPageLoad: boolean;
    displayMode: DisplayMode;
}

class DateTimeUtils {
    /**
     * Get time representation from a given date or from today.
     * @param datetime 
     */
    static getTime(datetime?) {
        return datetime ? new Date(Number(datetime)).setHours(0,0,0,0) : new Date().setHours(0,0,0,0);
    }

    /**
     * Get schedule time for a given display mode.
     * @param displayMode
     * @returns Date
     */
    static getScheduleTime(displayMode?: DisplayMode): Date {
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

    /**
     * Handle display=unique cases
     */
    private uniqueDisplayModeHandler(): void {
        const unique = Number(localStorage.getItem(this.internalId)) === 0;
        if (!unique) {
            localStorage.setItem(this.internalId, '0');
            this.open();
        }
    }
    /**
     * Handle scheduled day cases 
     */
    private scheduleDisplayModeHandler(): void {

        const currentScheduleDateTime = localStorage.getItem(this.internalId);

        // first time schedule or previously set to unique 
        if (!currentScheduleDateTime || currentScheduleDateTime === '0') {
            this.saveScheduleDateTime();
            return;
        }

        const currentScheduleDate = DateTimeUtils.getTime(currentScheduleDateTime);

        if (currentScheduleDate && currentScheduleDate === DateTimeUtils.getTime()) {
            this.open();
            this.saveScheduleDateTime();
        }
    }
    /**
     * Save the scheduled date time on localStorage
     */
    private saveScheduleDateTime(): void {
        const newScheduleDateTime = DateTimeUtils.getScheduleTime(this.options.displayMode);

        if (newScheduleDateTime) {
            localStorage.setItem(this.internalId, newScheduleDateTime.toString());
        }
    }

    /**
     * Executes the corresponding actions for each mode config.
     */
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

    /**
     * Register the event listeners for the modal.
     * We provide a close event on modal dismiss action to allow a they user to close the modal without
     * using jQuery or depending on it.
     */
    private registerEventListeners(): void {
        document.querySelector(`#${this.options.modalId} [data-dismiss="modal"]`).addEventListener("click", () => {
            this.close();
        });
    }

    /**
     * Provides a way to manually open the current modal
     */
    public open(): void {
        this.modalDomRef.style.display = ModalAction.OPEN;
    }
    
    /**
     * Provides a way to manually close the current modal
     */
    public close(): void {
        this.modalDomRef.style.display = ModalAction.CLOSE;
    }

}