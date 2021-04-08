<template>
  <b-container fluid>
    <b-card class="mb-4">
      <template #header>
        <div v-if="grp.name !== null">
          <span class="h4 float-left">{{ grp.name }}</span
          ><b-button
            v-if="editToggle"
            v-b-tooltip.hover.right
            variant="light"
            size="sm"
            class="float-left"
            title="Edit Group"
            @click="editGroup"
          >
            <BIconPencil />
          </b-button>
          <b-button
            :pressed.sync="editToggle"
            v-b-tooltip.hover
            variant="light"
            class="float-right"
            size="sm"
            title="Toggle Edit Buttons"
          >
            <BIconPencilFill v-if="editToggle" /><BIconPencil v-else />
          </b-button>
        </div>
        <div v-else>
          <b-form-group
            label="Add Group"
            class="h5 font-italic text-secondary mb-0"
            label-cols="4"
          >
            <b-button
              v-b-tooltip.hover
              block
              variant="outline-secondary"
              title="Add a new group"
              @click="createGroup"
            >
              <BIconPlus font-scale="2" />
            </b-button>
          </b-form-group>
        </div>
      </template>
      <div v-for="(link, btnIndex) in grp.linkList" :key="btnIndex">
        <b-button-group class="w-100 mb-3">
          <b-button
            class="w-100"
            :href="link.url"
            target="_blank"
            :variant="link.color"
            size="lg"
            block
          >
            {{ link.text }}
          </b-button>
          <b-button
            v-if="editToggle"
            v-b-tooltip.hover.top
            :variant="link.color"
            title="Edit Link"
            @click="editLink(link)"
          >
            <BIconPencil />
          </b-button>
          <b-button
            v-if="editToggle && btnIndex !== 0"
            :variant="link.color"
            title="Move Up"
            v-b-tooltip.hover.top
            @click="moveLink(btnIndex, true)"
            ><BIconChevronUp
          /></b-button>
          <b-button
            v-if="editToggle && btnIndex !== grp.linkList.length - 1"
            :variant="link.color"
            @click="moveLink(btnIndex, false)"
            title="Move Down"
            v-b-tooltip.hover.right
            ><BIconChevronDown
          /></b-button>
        </b-button-group>
      </div>
      <b-button
        v-if="editToggle"
        v-b-tooltip.hover.bottom
        variant="outline-secondary"
        block
        title="Add a new link"
        @click="createLink"
      >
        <BIconPlus font-scale="2" />
      </b-button> </b-card
    ><b-modal
      :id="linkModalName"
      :title="linkEditMode ? 'Edit Link' : 'New Link'"
      cancel-variant="danger"
      ok-variant="success"
      cancel-title="Delete"
      :ok-only="!linkEditMode"
      :ok-title="linkEditMode ? 'Save' : 'Create'"
      :ok-disabled="linkSaveDisabled"
      @hidden="resetLinkModal"
      @ok="saveLink"
      @cancel="deleteLink"
    >
      <b-form-group
        label="Link Name:"
        invalid-feedback="Link names must be unique within a group"
      >
        <b-form-input
          v-model="linkConfig.name"
          :state="linkNameValid"
          placeholder="Enter a display name for the link"
        />
      </b-form-group>
      <b-form-group
        label="Link URL:"
        invalid-feedback="URLs must start with http:// or https://"
      >
        <b-form-input
          v-model="linkConfig.url"
          :state="URLValid"
          placeholder="http://"
        />
      </b-form-group>
      <b-form-group label="Link color:">
        <b-form-radio
          v-for="(opt, idx) in colorOptionArray"
          :key="idx"
          v-model="linkConfig.color"
          class="m-2"
          :value="opt.value"
          button
          :button-variant="opt.value"
        >
          {{ opt.text }}
        </b-form-radio>
      </b-form-group>
      <b-form-group v-if="linkConfig.name" label="Preview:">
        <b-button
          :href="linkConfig.url"
          :variant="linkConfig.color"
          block
          target="_blank"
          size="lg"
        >
          {{ linkConfig.name }}
        </b-button>
      </b-form-group>
    </b-modal>
    <b-modal
      :id="grpModalName"
      :title="grp.name === null ? 'New Group' : 'Edit Group'"
      ok-title="Save"
      :ok-disabled="groupName === grp.name || !groupNameValid"
      cancel-title="Delete"
      ok-variant="success"
      cancel-variant="danger"
      :ok-only="grp.name === null"
      @hidden="resetGrpModal"
      @ok="saveGroup"
      @cancel="deleteGroup"
    >
      <b-form-group
        label="Group Name:"
        invalid-feedback="Group names must be unique within a dash"
      >
        <b-form-input
          v-model="groupName"
          :state="groupNameValid"
          placeholder="Enter a name for the group"
        />
      </b-form-group>
    </b-modal>
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

  initialLinkConfig: LinkConfig = { ...this.linkConfig };

  resetGrpModal() {
    this.groupName = null;
  }

  createGroup() {
    this.$bvModal.show(this.grpModalName);
  }

  get linkModalName() {
    return `link-modal-${this.dash.name}-${String(this.grp.name)}`;
  }

  get grpModalName() {
    return `grp-modal-${this.dash.name}-${String(this.grp.name)}`;
  }

  get URLValid() {
    if (this.linkConfig.url === null || this.linkConfig.url.length === 0) {
      return null;
    } else {
      const patt = new RegExp("^https?://");
      return patt.test(String(this.linkConfig.url));
    }
  }

  createLink() {
    this.linkConfig.dashName = this.dash.name;
    this.linkConfig.dashGroup = this.grp;
    this.$bvModal.show(this.linkModalName);
  }

  editLink(linkData: LinkData) {
    this.linkConfig.dashName = this.dash.name;
    this.linkConfig.dashGroup = this.grp;
    this.linkConfig.initialName = linkData.text;
    this.linkConfig.name = linkData.text;
    this.linkConfig.url = linkData.url;
    this.linkConfig.color = linkData.color;
    this.initialLinkConfig = { ...this.linkConfig };
    this.linkEditMode = true;
    this.$bvModal.show(this.linkModalName);
  }

  editGroup() {
    this.groupName = this.grp.name;
    this.$bvModal.show(this.grpModalName);
  }

  get linkSaveDisabled() {
    const lnk = this.linkConfig;
    return (
      lnk.name === null ||
      lnk.name.length === 0 ||
      lnk.url === null ||
      lnk.url.length === null ||
      lnk.color === null ||
      lnk.color.length === 0 ||
      this.linkNameValid !== true ||
      this.URLValid !== true ||
      !this.linkChanged
    );
  }

  get linkChanged() {
    const lnk = this.linkConfig;
    const init = this.initialLinkConfig;
    return (
      lnk.name !== init.name ||
      lnk.url !== init.url ||
      lnk.color !== init.color
    );
  }

  get groupNameValid() {
    if (this.groupName === this.grp.name) {
      return null;
    } else {
      return (
        this.grpNames.find(
          (x) =>
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
    const linkNames = this.linkConfig.dashGroup.linkList.map((x) =>
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
    this.$store.commit("addEditLink", this.linkConfig);
  }

  saveGroup() {
    this.$store.commit("addEditGroup", {
      dash: this.dash.name,
      name: this.grp.name,
      newName: this.groupName
    });
  }

  moveLink(index: number, moveUp: boolean) {
    const element = this.grp.linkList[index];
    const newLinkList = [...this.grp.linkList];
    newLinkList.splice(index, 1);
    if (moveUp) {
      newLinkList.splice(index - 1, 0, element);
    } else {
      newLinkList.splice(index + 1, 0, element);
    }
    const reorderConfig = {
      dashName: this.dash.name,
      name: this.grp.name,
      linkList: newLinkList
    };
    this.$store.commit("reorderGroup", reorderConfig);
  }

  deleteGroup() {
    this.$bvModal
      .msgBoxConfirm(
        `Are you sure that you want to delete '${String(this.grp.name)}'`,
        {
          title: "Confirm Group Deletion",
          okVariant: "danger",
          okTitle: "Delete"
        }
      )
      .then((value) => {
        if (value) {
          this.editToggle = false;
          this.$store.commit("deleteGroup", {
            dash: this.dash.name,
            name: this.grp.name,
            newName: null
          });
        }
      });
  }

  deleteLink() {
    // This copy is here to prevent the modal reset from wiping the config when the confirm modal fires.
    const deleteConfig = { ...this.linkConfig };
    this.$bvModal
      .msgBoxConfirm(
        `Are you sure that you want to delete '${String(deleteConfig.name)}'`,
        {
          title: "Confirm Link Deletion",
          okVariant: "danger",
          okTitle: "Delete"
        }
      )
      .then((value) => {
        if (value) {
          this.$store.commit("deleteLink", deleteConfig);
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
    this.initialLinkConfig = { ...this.linkConfig };
    this.linkEditMode = false;
  }
}
</script>
