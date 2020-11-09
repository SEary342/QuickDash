<template>
  <b-container fluid>
    <b-card class="mb-4">
      <template #header
        ><span class="h4 float-left">{{ grp.name }}</span
        ><b-button
          variant="light"
          size="sm"
          v-if="editToggle"
          class="float-left"
          @click="editGroup(dash.name, grp)"
          ><BIconPencil
        /></b-button>
        <b-button
          variant="light"
          class="float-right"
          size="sm"
          :pressed.sync="editToggle"
          ><BIconPencilFill v-if="editToggle"/><BIconPencil v-else
        /></b-button>
      </template>
      <div v-for="(link, btnIndex) in grp.linkList" :key="btnIndex">
        <b-button-group class="w-100 mb-3"
          ><b-button
            class="w-100"
            :href="link.url"
            target="_blank"
            :variant="link.color"
            size="lg"
            block
            >{{ link.text }}</b-button
          >
          <b-button
            v-if="editToggle"
            :variant="link.color"
            @click="editLink(link)"
            ><BIconPencil
          /></b-button>
        </b-button-group>
      </div>
      <b-button
        v-if="editToggle"
        variant="outline-secondary"
        block
        @click="createLink(dash.name, grp)"
        ><BIconPlus font-scale="2"/></b-button></b-card
    ><b-modal
      :id="'link-modal-'.concat(dash.name, '-', grp.name)"
      @hidden="resetLinkModal"
      :title="linkEditMode ? 'Edit Link' : 'New Link'"
      @ok="saveLink"
      @cancel="deleteLink"
      cancel-variant="danger"
      ok-variant="success"
      cancel-title="Delete"
      :ok-only="!linkEditMode"
      :ok-title="linkEditMode ? 'Save' : 'Create'"
      :ok-disabled="
        linkConfig.name === null ||
          linkConfig.name.length === 0 ||
          linkConfig.url === null ||
          linkConfig.url.length === null ||
          linkConfig.color === null ||
          linkConfig.color.length === 0 ||
          linkNameValid !== true
      "
    >
      <b-form-group label="Link Name:"
        ><b-form-input
          v-model="linkConfig.name"
          :state="linkNameValid"
        ></b-form-input
      ></b-form-group>
      <b-form-group label="Link url:"
        ><b-form-input v-model="linkConfig.url"></b-form-input
      ></b-form-group>
      <b-form-group label="Link color:">
        <b-form-radio
          class="m-2"
          v-for="(opt, idx) in colorOptionArray"
          :key="idx"
          v-model="linkConfig.color"
          :value="opt.value"
          button
          :button-variant="opt.value"
          >{{ opt.text }}</b-form-radio
        ></b-form-group
      >
      <b-form-group label="Preview:" v-if="linkConfig.name">
        <b-button
          :href="linkConfig.url"
          :variant="linkConfig.color"
          block
          target="_blank"
          size="lg"
          >{{ linkConfig.name }}</b-button
        >
      </b-form-group>
    </b-modal>
    <b-modal
      :id="'grp-modal-'.concat(dash.name, '-', grp.name)"
      title="Edit Group"
      ok-title="Save"
      :ok-disabled="groupName === grp.name || !groupNameValid"
      @hidden="resetGrpModal"
      cancel-title="Delete"
      ok-variant="success"
      cancel-variant="danger"
      @ok="saveGroup"
      @cancel="deleteGroup"
      ><b-form-group label="Group Name:"
        ><b-form-input
          v-model="groupName"
          :state="groupNameValid"
        ></b-form-input></b-form-group
    ></b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  ColorOption,
  LinkData,
  LinkGroup,
  ColorOptionArray
} from "../ConfigStructure";
import { DisplayDash } from "./LinkPanel.vue";

type LinkConfig = {
  initialName: string | null;
  name: string | null;
  url: string | null;
  dashName: string | null;
  dashGroup: LinkGroup | null;
  color: string;
};

type GrpName = { dash: string; grp: string };

@Component
export default class LinkCard extends Vue {
  @Prop({ required: true })
  public dash!: DisplayDash;

  @Prop({ required: true })
  public grp!: LinkGroup;

  @Prop({ required: true })
  public grpNames!: GrpName[];

  get colorOptionArray() {
    return ColorOptionArray;
  }

  editToggle = false;
  linkEditMode = false;

  groupName: string | null = null;

  linkConfig: LinkConfig = {
    initialName: null,
    name: null,
    url: null,
    dashName: null,
    dashGroup: null,
    color: ColorOption.Dark
  };

  resetGrpModal() {
    this.groupName = null;
  }

  createLink(dashName: string, dashGroup: LinkGroup) {
    this.linkConfig.dashName = dashName;
    this.linkConfig.dashGroup = dashGroup;
    this.$bvModal.show(
      "link-modal-".concat(this.dash.name, "-", this.grp.name)
    );
  }

  editLink(linkData: LinkData) {
    this.linkConfig.dashName = this.dash.name;
    this.linkConfig.dashGroup = this.grp;
    this.linkConfig.initialName = linkData.text;
    this.linkConfig.name = linkData.text;
    this.linkConfig.url = linkData.url;
    this.linkConfig.color = linkData.color;
    this.linkEditMode = true;
    this.$bvModal.show(
      "link-modal-".concat(this.dash.name, "-", this.grp.name)
    );
  }

  editGroup() {
    this.groupName = this.grp.name;
    this.$bvModal.show(
      "grp-modal-".concat(this.dash.name, "-", this.grp.name)
    );
  }

  get groupNameValid() {
    if (this.groupName === this.grp.name) {
      return null;
    } else {
      return (
        this.grpNames.find(
          x =>
            x.dash === this.dash.name &&
            x.grp.toLowerCase() === String(this.groupName).toLowerCase()
        ) === undefined
      );
    }
  }

  get linkNameValid() {
    if (
      this.linkConfig.name === null ||
      this.linkConfig.name === "" ||
      this.linkConfig.dashGroup === null
    ) {
      return null;
    }
    const linkNames = this.linkConfig.dashGroup.linkList.map(x =>
      x.text.toLowerCase()
    );
    if (this.linkEditMode) {
      const initName = this.linkConfig.initialName;
      if (initName !== null) {
        const itemIdx = linkNames.indexOf(initName.toLowerCase());
        if (itemIdx > -1) {
          linkNames.splice(itemIdx, 1);
        }
      }
    }
    return !linkNames.includes(String(this.linkConfig.name).toLowerCase());
  }

  saveLink() {
    // TODO save new links in the store
    console.log(this.linkConfig);
  }

  saveGroup() {
    const changeObj = {
      dash: this.dash.name,
      grp: this.grp.name,
      newName: this.groupName
    };
    // TODO connect save group to store
    console.log(changeObj);
  }

  deleteGroup() {
    this.$bvModal
      .msgBoxConfirm(
        "".concat(
          "Are you sure that you want to delete '",
          String(this.grp.name),
          "'"
        ),
        {
          title: "Confirm Group Deletion",
          okVariant: "danger",
          okTitle: "Delete"
        }
      )
      .then(value => {
        if (value) {
          // TODO connect delete group to store
          console.log(this.grp.name);
        }
      });
  }

  deleteLink() {
    const deleteConfig = { ...this.linkConfig };
    this.$bvModal
      .msgBoxConfirm(
        "".concat(
          "Are you sure that you want to delete '",
          String(deleteConfig.name),
          "'"
        ),
        {
          title: "Confirm Link Deletion",
          okVariant: "danger",
          okTitle: "Delete"
        }
      )
      .then(value => {
        if (value) {
          // TODO connect delete link to store
          console.log(deleteConfig);
        }
      });
  }

  resetLinkModal() {
    this.linkConfig = {
      initialName: null,
      name: null,
      url: null,
      color: ColorOption.Dark,
      dashName: null,
      dashGroup: null
    };
    this.linkEditMode = false;
  }
}
</script>
