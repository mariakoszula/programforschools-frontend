import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {DAIRY_PRODUCT, FRUIT_VEG_PRODUCT, DayColors} from "../namemapping.utils";
import {Subscription} from "rxjs";
import {RecordDataService} from "../../record-planner/record-data.service";
import {Record} from "../../record-planner/record.model";
import {Contract} from "../../documents/contract.model";
import {ProductStore} from "../../programs/program.model";
import {convert_date_from_backend_format, get_day} from "../date_converter.utils";

const MAXIMUM_CONTRACT_NO = 40;
const MAXIMUM_DATE_PER_WEEK_NO = 5;

@Component({
  selector: 'app-record-display',
  templateUrl: './record-display.component.html'
})
export class RecordDisplayComponent implements OnInit, OnDestroy, OnChanges {
  @Input() clickableView = true;
  @Input() records: Record[] = [];
  @Input() contracts: Contract[] = [];
  @Input() fruitVegProducts: ProductStore[] = [];
  @Input() dairyProducts: ProductStore[] = [];

  @Output() selectedRecordsEvent = new EventEmitter<Record[]>();

  selectedFruitVegRecords: Record[] = [];
  selectedDairyRecords: Record[] = [];
  sub: Subscription | null = null;
  dates: string[];
  FRUIT_VEG_PRODUCT = FRUIT_VEG_PRODUCT;
  DAIRY_PRODUCT = DAIRY_PRODUCT;
  productsMapping: { [key: string]: ProductStore[] } = {};

  min_dairy_items: number = 0;
  min_fruit_veg_items: number = 0;
  max_dairy_items: number = 0;
  max_fruit_veg_items: number = 0;
  productFruitVegStorage: string[][];
  productDairyStorage: string[][];

  constructor(private recordDataService: RecordDataService) {

    this.productFruitVegStorage = [];
    this.productDairyStorage = [];
    RecordDisplayComponent.initEmptyProducts(this.productFruitVegStorage);
    RecordDisplayComponent.initEmptyProducts(this.productDairyStorage);
    let program = this.recordDataService.getProgram();
    if (program.dairy_min_per_week && program.fruitVeg_min_per_week) {
      this.min_dairy_items = program.dairy_min_per_week;
      this.min_fruit_veg_items = program.fruitVeg_min_per_week;
    } else {
      console.error("Minimum per week for dairy and fruitVeg not setup");
    }
    if (program.dairy_amount && program.fruitVeg_amount) {
      this.max_dairy_items = program.dairy_amount;
      this.max_fruit_veg_items = program.fruitVeg_amount;
    } else {
      console.error("Maximum for dairy and fruitVeg not setup");
    }
    this.dates = this.recordDataService.getDates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.contracts = changes["contracts"] ? changes["contracts"].currentValue : this.contracts;
    this.fruitVegProducts = changes["fruitVegProducts"] ? changes["fruitVegProducts"].currentValue : this.fruitVegProducts;
    this.dairyProducts = changes["dairyProducts"] ? changes["dairyProducts"].currentValue : this.dairyProducts;
    this.records = changes["records"] ? changes["records"].currentValue : this.records;
    this.setRecordsInProductStorages();
  }

  static initEmptyProducts(storage_list: string[][]) {
    for (let i = 0; i < MAXIMUM_CONTRACT_NO; i++) {
      storage_list.push([]);
      for (let _ = 0; _ < MAXIMUM_DATE_PER_WEEK_NO; _++) {
        storage_list[i].push("");
      }
    }
  }

  ngOnInit(): void {
    this.sub = this.recordDataService.datesChanged.subscribe(dates => {
      this.dates = dates;
      this.setRecordsInProductStorages();
    });
    this.setRecordsInProductStorages();
  }


  private setRecordsInProductStorages() {
    this.productsMapping[this.FRUIT_VEG_PRODUCT] = this.fruitVegProducts;
    this.productsMapping[this.DAIRY_PRODUCT] = this.dairyProducts;
    this.setProducts(this.productFruitVegStorage, this.FRUIT_VEG_PRODUCT);
    this.setProducts(this.productDairyStorage, this.DAIRY_PRODUCT);
  }

  private setProducts(storage_list: string[][], product_type: string) {
    for (let contract_i = 0; contract_i < this.contracts.length; contract_i++) {
      if (contract_i > MAXIMUM_CONTRACT_NO) {
        throw Error("Change size of contract array");
      }
      for (let date_i = 0; date_i < this.dates.length; date_i++) {
        if (date_i > MAXIMUM_DATE_PER_WEEK_NO) {
          throw Error("Change size of date per week array");
        }
        storage_list[contract_i][date_i] = this.get_product(contract_i, date_i, product_type);
      }
    }
  }

  private get_storage(record: Record, product_type: string) {
    const product_storage = this.productsMapping[product_type].find(storage => record.product_store_id === storage.id);
    if (product_storage) {
      return product_storage;
    }
    return null;
  }

  private find_records(list_of_records: Record[], contract_index: number, data_index: number) {
    const contract = this.contracts[contract_index];
    const date = this.dates[data_index];
    return list_of_records.filter(record => record.contract_id === contract.id && record.date === date);
  }

  private get_record(contract_index: number, date_index: number, product_type: string): Record | null {
    const records = this.find_records(this.records, contract_index, date_index);
    let foundRecord: Record | null = null;
    if (records.length !== 0) {
      records.find(record => {
        if (this.get_storage(record, product_type)) {
          foundRecord = record;
        }
      })
    }
    return foundRecord;
  }

  private get_product(contract_index: number, date_index: number, product_type: string) {
    let found_record = this.get_record(contract_index, date_index, product_type);
    let product_name = "";
    if (found_record) {
      const product_storage = this.get_storage(found_record, product_type);
      if (product_storage) {
        product_name = product_storage.product.name;
      }
    }
    return product_name;
  }

  private onRecordSelect(contract_index: number, date_index: number, product_type: string, selectedRecord: Record[]) {
    const record: Record | null = this.get_record(contract_index, date_index, product_type);
    if (record) {
      let recordAlreadySelected = selectedRecord.find(_record => _record.id === record!.id);
      if (recordAlreadySelected) {
        selectedRecord.splice(selectedRecord.indexOf(recordAlreadySelected), 1);
      } else {
        selectedRecord.push(record);
      }
    }
  }

  private emitSelectedRecordsEvent() {
    this.selectedRecordsEvent.next(this.selectedFruitVegRecords.concat(this.selectedDairyRecords));
  }

  onFruitVegRecordSelect(contract_index: number, date_index: number) {
    this.onRecordSelect(contract_index, date_index, FRUIT_VEG_PRODUCT, this.selectedFruitVegRecords);
    this.emitSelectedRecordsEvent();
  }

  onDairyRecordSelect(contract_index: number, date_index: number) {
    this.onRecordSelect(contract_index, date_index, DAIRY_PRODUCT, this.selectedDairyRecords);
    this.emitSelectedRecordsEvent();
  }

  isActiveFruitVeg(contract_index: number, date_index: number) {
    let results = this.find_records(this.selectedFruitVegRecords, contract_index, date_index);
    return results.length === 1;
  }

  isActiveDairy(contract_index: number, date_index: number) {
    let results = this.find_records(this.selectedDairyRecords, contract_index, date_index);
    return results.length === 1;
  }

  getColor(record: Record) {
    const date = record.delivery_date;
    let day = date ? get_day(convert_date_from_backend_format(date)) : null
    if (day && day >= 1 && day <= 5) {
      return DayColors[day - 1];
    }
    return 'transparent';
  }

  getColorFruitVeg(contract_index: number, date_index: number) {
    let record = this.get_record(contract_index, date_index, FRUIT_VEG_PRODUCT);
    return this.getColor(record!);
  }

  getColorDairy(contract_index: number, date_index: number) {
    let record = this.get_record(contract_index, date_index, DAIRY_PRODUCT);
    return this.getColor(record!);
  }

  changeToHoverColor($event: any) {
    $event.target.style.color = '#ffffff'
    $event.target.style.backgroundColor = "#343a40";
  }

  private changeToDefaultColor($event: any, baseColor: string) {
    if ($event.target.className.includes('active')) {
      $event.target.style.color = '#ffffff'
      $event.target.style.backgroundColor = "#343a40";
    } else {
      $event.target.style.color = '#343a40'
      $event.target.style.backgroundColor = baseColor;
    }
  }

  changeToDefaultColorDiary($event: any, contract_index: number, date_index: number) {
    this.changeToDefaultColor($event, this.getColorDairy(contract_index, date_index));
  }

  changeToDefaultColorFruitVeg($event: any, contract_index: number, date_index: number) {
    this.changeToDefaultColor($event, this.getColorFruitVeg(contract_index, date_index));
  }

  fruitVegPerWeek(contract_index: number) {
    return this.productFruitVegStorage[contract_index].filter(item => item !== "").length;
  }

  dairyPerWeek(contract_index: number) {
    return this.productDairyStorage[contract_index].filter(item => item !== "").length;
  }

  getPerWeekColor(no_of_items: number, min_items: number) {
    if (no_of_items == min_items) {
      return '#2ECC71'
    }
    if (no_of_items < min_items) {
      return '#fcf92b';
    }
    if (no_of_items > min_items) {
      return '#ffcc33'
    }
    return 'transparent';
  }

  getSummarisedColor(no_of_items: number, min_items: number) {
    if (no_of_items == min_items) {
      return '#2ECC71'
    }
    if (no_of_items > min_items) {
      return '#ffcc33'
    }
    return 'transparent';
  }

  getSummarisedRecord(contract_index: number, product_type: string) {
    const contract = this.contracts[contract_index];
    return this.records.filter(record => record.contract_id === contract.id && record.product_type === product_type).length;
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
